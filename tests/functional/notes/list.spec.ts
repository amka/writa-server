import { test } from '@japa/runner'
import Note from 'App/Models/Note'
import User from 'App/Models/User'

test.group('Notes list', (group) => {
  group.setup(async () => {
    await User.create({
      email: 'test@writa.app',
      password: 'password'
    })

    await Note.create({
      title: 'Test note',
      content: '# This is a test note',
      authorId: 1
    })
  })

  test('get a paginated list of notes', async ({ client }) => {
    const user = await User.find(1)
    const response = await client.get('/api/notes').loginAs(user!)

    response.assertStatus(200)
    response.assertBodyContains({ data: [] })
  })

  test('create a note', async ({ client }) => {
    const user = await User.find(1)
    const response = await client.post('/api/notes').loginAs(user!).json({
      title: 'Test note',
      content: '# This is a test note'
    })

    response.assertStatus(201)
    response.assertBodyContains({ title: 'Test note' })
  })

  test('update a note', async ({ client }) => {
    const user = await User.find(1)
    const response = await client.put('/api/notes/1').loginAs(user!).json({
      title: 'Test note edited',
    })

    response.assertStatus(204)
  })

  test('delete a note', async ({ client }) => {
    const user = await User.find(1)

    await client.post('/api/notes').loginAs(user!).json({
      title: 'Test note',
      content: '# This is a test note'
    })

    const response = await client.delete('/api/notes/1').loginAs(user!)

    response.assertStatus(204)
  })
})
