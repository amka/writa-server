import { test } from '@japa/runner'

test.group('Auth', () => {
  // Write your test here
  test('register new user', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'test@writa.app',
      password: 'password'
    })

    response.assertStatus(201)
    response.assertBodyContains({ token: Object, user: { email: 'test@writa.app' } })
  })

  test('login as new user', async ({ client }) => {
    const email = 'test@writa.app'
    const password = 'password'
    await client.post('/api/auth/register').json({ email, password })

    const response = await client.post('/api/auth/login').json({ email, password })

    response.assertStatus(200)
    response.assertBodyContains({ token: Object})
  })
})
