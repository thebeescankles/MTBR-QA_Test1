import { APIRequestContext } from '@playwright/test';
import { env, testPassword } from '../config/environments';

export interface TestUser {
  userId: string;
  userName: string;
  password: string;
}

export class AccountApi {
  constructor(private readonly request: APIRequestContext) {}

  /** Creates a unique user for the current test run via POST /Account/v1/User */
  async createUser(): Promise<TestUser> {
    const userName = `qa_auto_${Date.now()}_${Math.floor(Math.random() * 1_000)}`;
    const response = await this.request.post(`${env.apiURL}/Account/v1/User`, {
      data: { userName, password: testPassword },
    });

    if (!response.ok()) {
      throw new Error(
        `User creation failed [${response.status()}]: ${await response.text()}`,
      );
    }

    const body = await response.json();
    return { userId: body.userID, userName, password: testPassword };
  }

  /** Deletes the user (authorized via API login token) — leaves no residue */
  async deleteUser(user: TestUser): Promise<void> {
    const token = await this.getToken(user);
    await this.request.delete(`${env.apiURL}/Account/v1/User/${user.userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  private async getToken(user: TestUser): Promise<string> {
    const response = await this.request.post(`${env.apiURL}/Account/v1/Login`, {
      data: { userName: user.userName, password: user.password },
    });
    if (!response.ok()) {
      throw new Error(`API login failed [${response.status()}]`);
    }
    const body = await response.json();
    return body.token;
  }
}