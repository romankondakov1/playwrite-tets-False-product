import { test, expect } from '@playwright/test';

const BASE_URL_USERS = 'https://api.escuelajs.co/api/v1/users';

test.describe('Users API', { tag: '@Users' }, () => {

  let userId: number;
  let userName: string;
  let userEmail: string;

  test.beforeEach(async ({ request }) => {

    await test.step('Create user', async () => {

      const email = `roma_${Date.now()}@gmail.com`;

      const response = await request.post(BASE_URL_USERS, {
        data: {
          name: 'Roman',
          email,
          password: '1234',
          avatar: 'https://picsum.photos/880'
        }
      });

      const body = await response.json();

      expect(response.status()).toBe(201);
      expect.soft(response.headers()['content-type']).toContain('application/json');
      expect.soft(body).toHaveProperty('name', 'Roman');
      expect.soft(body).toHaveProperty('email', email);

      userId = body.id;
      userName = body.name;
      userEmail = body.email;
    });

  });

  test.afterEach(async ({ request }) => {

    await test.step('Delete user', async () => {

      const response = await request.delete(
        `${BASE_URL_USERS}/${userId}`,
        { failOnStatusCode: false }
      );

      expect([200, 404]).toContain(response.status());

    });

  });

  test('Get user', async ({ request }) => {

    await test.step('Get created user', async () => {

      const response = await request.get(`${BASE_URL_USERS}/${userId}`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect.soft(body.id).toBe(userId);
      expect.soft(body.name).toBe(userName);
      expect.soft(body.email).toBe(userEmail);

    });

  });

  test('Update user', async ({ request }) => {

    const updatedName = `Updated ${userName}`;
    const updatedEmail = `updated_${userEmail}`;

    await test.step('Update user', async () => {

      const response = await request.put(`${BASE_URL_USERS}/${userId}`, {
        data: {
          name: updatedName,
          email: updatedEmail
        }
      });

      expect(response.status()).toBe(200);
      expect.soft(response.headers()['content-type']).toContain('application/json');
      expect.soft(await response.json()).toHaveProperty('name', updatedName);
      expect.soft(await response.json()).toHaveProperty('email', updatedEmail);

    });

    await test.step('Verify updated user', async () => {

      const response = await request.get(`${BASE_URL_USERS}/${userId}`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body.name).toBe(updatedName);
      expect(body.email).toBe(updatedEmail);

    });

  });

});