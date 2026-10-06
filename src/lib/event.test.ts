import { describe, it, expect, vi } from "vitest";
import { createSlug, slugify } from "./event";

const { findUniqueMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findUnique: findUniqueMock,
    },
  },
}));

describe("slugify", () => {
  it("converts a title into a slug", () => {
    expect(slugify("Feria Cochabamba")).toBe("feria-cochabamba");
  });

  it("removes accents", () => {
    expect(slugify("Fería Cochabámba")).toBe("feria-cochabamba");
  });

  it("replaces special characters and extra spaces", () => {
    expect(slugify("  Feria & Kermesse 2026!!! ")).toBe("feria-kermesse-2026");
  });

  it("normalizes styled unicode characters", () => {
    expect(slugify("𝙁𝙚𝙨𝙩𝙞𝙫𝙖𝙡 𝙙𝙚 𝙘𝙖𝙧𝙣𝙚𝙨 𝙖 𝙡𝙖 𝙘𝙧𝙪𝙯 𝙮 𝙖 𝙡𝙖 𝙥𝙖𝙧𝙧𝙞𝙡𝙡𝙖")).toBe(
      "festival-de-carnes-a-la-cruz-y-a-la-parrilla"
    );
  });

  it("removes accents", () => {
    expect(slugify("Feria de la Salteña")).toBe("feria-de-la-saltena");
  });

  it("removes extra separators", () => {
    expect(slugify("  Feria --- Cochabamba!!!  ")).toBe("feria-cochabamba");
  });
});

describe("createSlug", () => {
  it("returns the base slug when it does not exist", async () => {
    findUniqueMock.mockResolvedValue(null);

    const slug = await createSlug("Feria Cochabamba");

    expect(slug).toBe("feria-cochabamba");
  });

  it("adds -2 when the base slug already exists", async () => {
    findUniqueMock
      .mockResolvedValueOnce({ id: "event-1" })
      .mockResolvedValue(null);

    const slug = await createSlug("Feria Cochabamba");
    expect(slug).toBe("feria-cochabamba-2");
  });

  it("adds -3 when the base slug and -2 already exists", async () => {
    findUniqueMock
      .mockResolvedValueOnce({ id: "event-1" })
      .mockResolvedValueOnce({ id: "event-2" })
      .mockResolvedValue(null);

    const slug = await createSlug("Feria Cochabamba");

    expect(slug).toBe("feria-cochabamba-3");
  });

  it("keeps the matching suffixed slug when editing the same event", async () => {
    findUniqueMock
      .mockResolvedValueOnce({ id: "event-1" })
      .mockResolvedValueOnce({ id: "event-2" });

    const slug = await createSlug("Feria Cochabamba", "event-2");

    expect(slug).toBe("feria-cochabamba-2");
  });
});
