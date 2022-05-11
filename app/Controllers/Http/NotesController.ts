import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Note from 'App/Models/Note';
import CreateNoteValidator from 'App/Validators/CreateNoteValidator';
import UpdateNoteValidator from 'App/Validators/UpdateNoteValidator';

export default class NotesController {

  /**
   * Get all notes paginated.
   *
   * @param HttpContextContract
   * @returns
   */
  public async index({ auth, response, request }: HttpContextContract) {
    const page = request.input('page', 1);

    const notes = await Note.query()
      .where('author_id', auth.user!.id)
      .paginate(page);

    return response.ok(notes);
  }

  /**
   * Create a note.
   *
   * Note will be created with the user id as the author id.
   *
   * @param HttpContextContract
   * @returns
   */
  public async store({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(CreateNoteValidator);
    const note = await Note.create({
      title: payload.title,
      content: payload.content,
      authorId: auth.user!.id,
    })

    return response.created(note);
  }

  /**
   * Get a note by id.
   *
   * If note is not found, throw a 404 error.
   * If note is not owned by the user, throw a 403 error.
   *
   * @param HttpContextContract
   * @returns
   */
  public async show({ request, auth, response }: HttpContextContract) {
    const noteId = request.param('id');
    const note = await Note.findOrFail(noteId);

    if (note.authorId != auth.user!.id) {
      throw new Error('You are not authorized to access this note');
    }

    return response.ok(note);
  }

  /**
   * Update a note.
   *
   * If note not found, throw a 404 error.
   * If note is not owned by the user, throw a 403 error.
   *
   * @param HttpContextContract
   * @returns
   */
  public async update({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(UpdateNoteValidator);
    const noteId = request.param('id');
    const note = await Note.findOrFail(noteId);

    if (note.authorId != auth.user!.id) {
      throw new Error('You are not authorized to access this note');
    }

    note.title = payload.title ?? note.title;
    note.content = payload.content ?? note.content;

    await note.save();

    return response.noContent()
  }

  /**
   * Delete a note.
   *
   * If note not found, throw a 404 error.
   * If note is not owned by the user, throw a 403 error.
   *
   * @param HttpContextContract
   * @returns
   */
  public async destroy({ auth, request, response }: HttpContextContract) {
    const noteId = request.param('id')
    const note = await Note.findOrFail(noteId);

    if (note.authorId != auth.user!.id) {
      throw new Error('You are not authorized to access this note');
    }

    return response.noContent()
  }
}
