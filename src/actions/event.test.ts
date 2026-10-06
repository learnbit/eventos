import { beforeEach, describe, expect, it, vi } from "vitest";
import { approveEvent, createEvent, rejectEvent, updateEvent } from "./event";

const {
  authMock,
  findUniqueMock,
  updateMock,
  createSlugMock,
  uploadFileToS3Mock,
  deleteFileFromS3Mock,
  createMock,
  redirectMock,
  isAdminMock,
} = vi.hoisted(() => ({
  authMock: vi.fn(),
  findUniqueMock: vi.fn(),
  updateMock: vi.fn(),
  createSlugMock: vi.fn(),
  uploadFileToS3Mock: vi.fn(),
  deleteFileFromS3Mock: vi.fn(),
  createMock: vi.fn(),
  redirectMock: vi.fn(),
  isAdminMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  isAdmin: isAdminMock,
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findUnique: findUniqueMock,
      update: updateMock,
      create: createMock,
    },
  },
}));

vi.mock("@/lib/event", () => ({
  createSlug: createSlugMock,
}));

vi.mock("@/lib/s3", () => ({
  uploadFileToS3: uploadFileToS3Mock,
  deleteFileFromS3: deleteFileFromS3Mock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/telegram", () => ({
  sendTelegramMessage: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("updateEvent", () => {
  it("returns an error when the user is not authenticated", async () => {
    authMock.mockResolvedValue({
      userId: null,
    });

    const formData = new FormData();

    const result = await updateEvent("event-1", { error: null }, formData);

    expect(result).toEqual({
      error: "Debes iniciar sesión.",
    });
  });

  it("returns an error when the event is not found", async () => {
    authMock.mockResolvedValue({ userId: "user-1" });

    findUniqueMock.mockResolvedValue(null);

    const formData = new FormData();

    const result = await updateEvent("event-1", { error: null }, formData);

    expect(result).toEqual({
      error: "Event not found.",
    });
  });

  it("returns an error when the event belongs to another user", async () => {
    authMock.mockResolvedValue({
      userId: "user-1",
    });

    findUniqueMock.mockResolvedValue({
      id: "event-1",
      userId: "user-2",
    });

    const formData = new FormData();
    const result = await updateEvent("event-1", { error: null }, formData);

    expect(result).toEqual({
      error: "No tienes permiso para editar este evento.",
    });
  });

  it("sets the event back to pending when it is edited", async () => {
    authMock.mockResolvedValue({
      userId: "user-1",
    });

    findUniqueMock.mockResolvedValue({
      id: "event-1",
      userId: "user-1",
      image: null,
    });

    createSlugMock.mockResolvedValue("feria-cochabamba");

    updateMock.mockResolvedValue({
      id: "event-1",
      slug: "feria-cochabamba",
    });

    const formData = new FormData();
    formData.set("title", "Feria Cochabamba");
    formData.set("category", "feria");
    formData.set("date", "2026-10-10");
    formData.set("time", "18:00");
    formData.set("location", "Cochabamba");
    formData.set("description", "Evento actualizado");

    await updateEvent("event-1", { error: null }, formData);

    expect(updateMock).toHaveBeenCalledWith({
      where: {
        id: "event-1",
      },
      data: expect.objectContaining({
        status: "pending",
        rejectionReason: null,
      }),
    });
  });

  it("replaces the old image when a new image is uploaded", async () => {
    authMock.mockResolvedValue({
      userId: "user-1",
    });

    findUniqueMock.mockResolvedValue({
      id: "event-1",
      userId: "user-1",
      image: "events/old-image.jpg",
    });

    createSlugMock.mockResolvedValue("feria-cochabamba");

    uploadFileToS3Mock.mockResolvedValue("events/new-image.jpg");

    updateMock.mockResolvedValue({
      id: "event-1",
      slug: "feria-cochabamba",
    });

    const formData = new FormData();
    formData.set("title", "Feria Cochabamba");
    formData.set("category", "feria");
    formData.set("date", "2026-10-10");
    formData.set("time", "18:00");
    formData.set("location", "Cochabamba");
    formData.set("description", "Evento actualizado");

    const image = new File(["image content"], "new-image.jpg", {
      type: "image/jpeg",
    });

    formData.set("image", image);

    await updateEvent("event-1", { error: null }, formData);

    expect(uploadFileToS3Mock).toHaveBeenCalledWith(image);

    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          image: "events/new-image.jpg",
        }),
      })
    );

    expect(deleteFileFromS3Mock).toHaveBeenCalledWith("events/old-image.jpg");
  });

  it("deletes the new image when updating the event fails", async () => {
    authMock.mockResolvedValue({
      userId: "user-1",
    });

    findUniqueMock.mockResolvedValue({
      id: "event-1",
      userId: "user-1",
      image: "events/old-image.jpg",
    });

    createSlugMock.mockResolvedValue("feria-cochabamba");

    uploadFileToS3Mock.mockResolvedValue("events/new-image.jpg");

    updateMock.mockRejectedValueOnce(new Error("Database error"));

    const formData = new FormData();
    formData.set("title", "Feria Cochabamba");
    formData.set("category", "feria");
    formData.set("date", "2026-10-10");
    formData.set("time", "18:00");
    formData.set("location", "Cochabamba");
    formData.set("description", "Evento actualizado");

    const image = new File(["image content"], "new-image.jpg", {
      type: "image/jpeg",
    });
    formData.set("image", image);

    await expect(
      updateEvent("event-1", { error: null }, formData)
    ).rejects.toThrow("Database error");

    expect(deleteFileFromS3Mock).toHaveBeenCalledWith("events/new-image.jpg");
  });
});

describe("createEvent", () => {
  it("returns an error when the user is not authenticated", async () => {
    authMock.mockResolvedValue({
      userId: null,
    });

    const formData = new FormData();

    const result = await createEvent({ error: null }, formData);

    expect(result).toEqual({
      error: "Debes iniciar sesión.",
    });
  });

  it("returns an error when the category is invalid", async () => {
    authMock.mockResolvedValue({
      userId: "user-1",
    });

    const formData = new FormData();
    formData.set("title", "Feria Cochabamba");
    formData.set("category", "invalid-category");
    formData.set("date", "2026-10-10");
    formData.set("time", "18:00");
    formData.set("location", "Cochabamba");
    formData.set("description", "Evento de prueba");

    const result = await createEvent({ error: null }, formData);

    expect(result).toEqual({
      error: "La categoría no es válida.",
    });
  });

  it("creates an event with the authenticated user", async () => {
    authMock.mockResolvedValue({
      userId: "user-1",
    });

    createSlugMock.mockResolvedValue("feria-cochabamba");

    createMock.mockResolvedValue({
      id: "event-1",
      title: "Feria Cochabamba",
      slug: "feria-cochabamba",
    });

    const formData = new FormData();
    formData.set("title", "Feria Cochabamba");
    formData.set("category", "feria");
    formData.set("date", "2026-10-10");
    formData.set("time", "18:00");
    formData.set("location", "Cochabamba");
    formData.set("description", "Evento de prueba");

    await createEvent({ error: null }, formData);

    expect(createMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        slug: "feria-cochabamba",
        title: "Feria Cochabamba",
        category: "feria",
        location: "Cochabamba",
        description: "Evento de prueba",
        userId: "user-1",
        image: null,
      }),
    });

    expect(redirectMock).toHaveBeenCalledWith("/events/feria-cochabamba");
  });
});

describe("approveEvent", () => {
  it("approves a pending event", async () => {
    authMock.mockResolvedValue({
      userId: "admin-1",
    });

    isAdminMock.mockReturnValue(true);

    findUniqueMock.mockResolvedValue({
      id: "event-1",
      status: "pending",
    });

    await approveEvent("event-1");

    expect(updateMock).toHaveBeenCalledWith({
      where: {
        id: "event-1",
      },
      data: {
        status: "approved",
        rejectionReason: null,
        isHidden: false,
      },
    });
  });
});

describe("rejectEvent", () => {
  it("rejects an event with a reason", async () => {
    authMock.mockResolvedValue({
      userId: "admin-1",
    });

    isAdminMock.mockReturnValue(true);

    findUniqueMock.mockResolvedValue({
      id: "event-1",
      status: "pending",
    });

    const formData = new FormData();
    formData.set("reason", "  Información incompleta  ");

    await rejectEvent("event-1", formData);

    expect(updateMock).toHaveBeenCalledWith({
      where: {
        id: "event-1",
      },
      data: {
        status: "rejected",
        rejectionReason: "Información incompleta",
      },
    });
  });
});
