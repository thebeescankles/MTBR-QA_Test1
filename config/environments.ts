export type EnvName = 'prod';

interface EnvConfig {
  baseURL: string;
  apiURL: string;
}

const environments: Record<EnvName, EnvConfig> = {
  prod: {
    baseURL: 'https://demoqa.com',
    apiURL: 'https://demoqa.com',
  },
};

export const env: EnvConfig =
  environments[(process.env.ENV as EnvName) ?? 'prod'];

export const testPassword = process.env.TEST_PASSWORD ?? 'Auto!Test123';