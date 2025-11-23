import { getCurrentYear, getFooterCopy, getLatestNotification } from "./utils";

// Group tests for utility helpers used across the dashboard project.
describe("utils", () => {
  describe("getCurrentYear()", () => {
    test("returns the current year", () => {
      const currentYear = new Date().getFullYear();
      expect(getCurrentYear()).toBe(currentYear);
    });
  });

  describe("getFooterCopy()", () => {
    test("returns the Holberton School copy when index flag is true", () => {
      expect(getFooterCopy(true)).toBe("Holberton School");
    });

    test("returns the main dashboard copy when index flag is false", () => {
      expect(getFooterCopy(false)).toBe("Holberton School main dashboard");
    });
  });

  describe("getLatestNotification()", () => {
    test("returns the expected urgent requirement string", () => {
      expect(getLatestNotification()).toBe(
        "<strong>Urgent requirement</strong> - complete by EOD"
      );
    });
  });
});
