const { nextTimeFromNow } = require("./utils");

describe("nextTimeFromNow", () => {
  const mockDate = new Date("2025-10-06T12:00:00Z"); // UTC

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("headway = 3 → retour +3 min", () => {
    expect(nextTimeFromNow(3)).toBe("12:03");
  });

  test("valeur par défaut → même résultat qu'avec 3", () => {
    expect(nextTimeFromNow()).toBe("12:03");
  });

  test("headway invalide (≤0) → retourne null", () => {
    expect(nextTimeFromNow(0)).toBeNull();
    expect(nextTimeFromNow(-5)).toBeNull();
    expect(nextTimeFromNow("abc")).toBeNull();
  });
});
