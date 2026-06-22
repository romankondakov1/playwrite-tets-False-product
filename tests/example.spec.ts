import { test, expect } from '@playwright/test';

test('Get products list', async ({ request }) => {
  const response = await request.get(
    'https://api.escuelajs.co/api/v1/products',
    {failOnStatusCode: false}
  );
  const products = await response.json();
  expect(response.status()).toBe(200);
  expect(Array.isArray(products)).toBe(true);
  expect(response.statusText()).toBe('OK');
});

test('Create product', async ({ request }) => {

  const uniqueTitle = `New Product ${Date.now()}`;
  const createResponse = await request.post('https://api.escuelajs.co/api/v1/products', {
    data: {
      title: uniqueTitle,
      price: 350,
      description: 'Best Product ever',
      categoryId: 1,
      images: ['https://placehold.co/600x400']
    }
  });

  
  const jsonData = await createResponse.json();
  const productId = jsonData.id;
  expect(jsonData.title).toBe(uniqueTitle);
  expect(createResponse.status()).toBe(201);

  const getResponse = await request.get(
    `https://api.escuelajs.co/api/v1/products/${productId}`,
    { failOnStatusCode: true }
  );

  expect(getResponse.status()).toBe(200);
  const product = await getResponse.json();
  expect(product.id).toBe(productId);
});

test('Get products id after creation', async ({ request }) => {
  
  const uniqueTitle = `New Product ${Date.now()}`;
  const createResponse = await request.post('https://api.escuelajs.co/api/v1/products', {
    data: {
      title: uniqueTitle,
      price: 350,
      description: 'Best Product ever',
      categoryId: 1,
      images: ['https://placehold.co/600x400']
    }
  });

  
  const jsonData = await createResponse.json();
  const productId = jsonData.id;
  expect(jsonData.title).toBe(uniqueTitle);
  expect(createResponse.status()).toBe(201);

  const getResponse = await request.get(`https://api.escuelajs.co/api/v1/products/${productId}`, { failOnStatusCode: false });
  
  const product = await getResponse.json();
  expect(product.id).toBe(productId);
  expect(getResponse.status()).toBe(200);
});

test('Update product', async ({ request }) => {
  
  const uniqueTitle = `New Product ${Date.now()}`;
  const createResponse = await request.post('https://api.escuelajs.co/api/v1/products', {
    data: {
      title: uniqueTitle,
      price: 350,
      description: 'Best Product ever',
      categoryId: 1,
      images: ['https://placehold.co/600x400']
    }
  });

  expect(createResponse.status()).toBe(201);
  const jsonData = await createResponse.json();
  const productId = jsonData.id;
  expect(jsonData.title).toBe(uniqueTitle);

  const updateResponse = await request.put(`https://api.escuelajs.co/api/v1/products/${productId}`, {
    data: {
      title: 'Updated Product ' + uniqueTitle,
      price: 250,
      description: 'Updated Best Product',
      categoryId: 1,
      images: ['https://placehold.co/600x400']
    }
  });

  expect(updateResponse.status()).toBe(200);
  const updatedResponse = await request.get(`https://api.escuelajs.co/api/v1/products/${productId}`);
  const updatedJsonData = await updatedResponse.json();

  expect(updatedResponse.status()).toBe(200);
  expect(updatedJsonData.title).toBe('Updated Product ' + uniqueTitle);
});





test('Delete product', async ({ request }) => {
  
  const uniqueTitle = `New Product ${Date.now()}`;
  const createResponse = await request.post('https://api.escuelajs.co/api/v1/products', {
    data: {
      title: uniqueTitle,
      price: 350,
      description: 'Best Product ever',
      categoryId: 1,
      images: ['https://placehold.co/600x400']
    }
  });

  expect(createResponse.status()).toBe(201);
  const jsonData = await createResponse.json();
  const productId = jsonData.id;
  expect(jsonData.title).toBe(uniqueTitle);

  const deleteResponse = await request.delete(`https://api.escuelajs.co/api/v1/products/${productId}`);
  expect(deleteResponse.status()).toBe(200);

   const getAfterDeleteResponse = await request.get(`https://api.escuelajs.co/api/v1/products/${productId}`);

  expect(getAfterDeleteResponse.status()).toBe(400);

});


