import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Story from 'App/Models/Story';
import User from 'App/Models/User';

export default class Note extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public content: string

  @column()
  public authorId: number

  @belongsTo(() => User)
  public author: BelongsTo<typeof User>

  @column()
  public storyId: number

  @belongsTo(() => Story)
  public story: BelongsTo<typeof Story>

  @column()
  public slug: string

  @column()
  public deleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
