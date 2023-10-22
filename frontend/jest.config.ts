    export default {
      moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "<rootDir>/src/style-mock.ts"
      },
      roots: ["<rootDir>/src"],
    
      transform: {
        "^.+\\.tsx?$": "ts-jest"
      },
      testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
      moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
      transformIgnorePatterns: ["/node_modules/(?!react-toastify)"],
      testEnvironment: "jsdom",
    };