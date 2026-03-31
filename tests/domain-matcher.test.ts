import { describe, it, expect } from "vitest";
import { domainMatches } from "../src/shared/domain-matcher";

describe("domainMatches", () => {
  const blacklist = new Set([
    "twitter.com",
    "x.com",
    "facebook.com",
    "reddit.com",
    "youtube.com",
    "news.ycombinator.com",
  ]);

  describe("exact domain match", () => {
    it("matches a blacklisted domain", () => {
      expect(domainMatches("https://twitter.com/home", blacklist)).toBe(true);
    });

    it("matches another blacklisted domain", () => {
      expect(domainMatches("https://reddit.com/r/programming", blacklist)).toBe(
        true,
      );
    });

    it("does not match a safe domain", () => {
      expect(domainMatches("https://linkedin.com/feed", blacklist)).toBe(false);
    });

    it("does not match a safe domain (google)", () => {
      expect(domainMatches("https://google.com/search?q=test", blacklist)).toBe(
        false,
      );
    });
  });

  describe("www prefix stripping", () => {
    it("matches www.twitter.com against twitter.com", () => {
      expect(domainMatches("https://www.twitter.com/home", blacklist)).toBe(
        true,
      );
    });

    it("matches www.youtube.com against youtube.com", () => {
      expect(
        domainMatches("https://www.youtube.com/watch?v=abc", blacklist),
      ).toBe(true);
    });

    it("does not match www.linkedin.com (not blacklisted)", () => {
      expect(domainMatches("https://www.linkedin.com/feed", blacklist)).toBe(
        false,
      );
    });
  });

  describe("subdomain matching", () => {
    it("matches subdomain m.facebook.com against facebook.com", () => {
      expect(domainMatches("https://m.facebook.com/", blacklist)).toBe(true);
    });

    it("matches subdomain mobile.twitter.com against twitter.com", () => {
      expect(
        domainMatches("https://mobile.twitter.com/home", blacklist),
      ).toBe(true);
    });

    it("matches deep subdomain video.xx.facebook.com", () => {
      expect(
        domainMatches("https://video.xx.facebook.com/stream", blacklist),
      ).toBe(true);
    });

    it("matches exact subdomain news.ycombinator.com", () => {
      expect(
        domainMatches("https://news.ycombinator.com/", blacklist),
      ).toBe(true);
    });

    it("does not match unrelated domain with similar suffix", () => {
      expect(domainMatches("https://nottwitter.com/", blacklist)).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("returns false for invalid URL", () => {
      expect(domainMatches("not-a-url", blacklist)).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(domainMatches("", blacklist)).toBe(false);
    });

    it("returns false for empty blacklist", () => {
      expect(domainMatches("https://twitter.com", new Set())).toBe(false);
    });

    it("handles URL with port number", () => {
      expect(
        domainMatches("https://twitter.com:443/home", blacklist),
      ).toBe(true);
    });

    it("handles URL with path, query, and hash", () => {
      expect(
        domainMatches(
          "https://reddit.com/r/javascript?sort=hot#top",
          blacklist,
        ),
      ).toBe(true);
    });

    it("handles http protocol", () => {
      expect(domainMatches("http://facebook.com/login", blacklist)).toBe(true);
    });

    it("returns false for chrome:// URLs", () => {
      expect(domainMatches("chrome://extensions/", blacklist)).toBe(false);
    });

    it("returns false for about: URLs", () => {
      expect(domainMatches("about:blank", blacklist)).toBe(false);
    });
  });
});
