const keystone = require('keystone')
const Types = keystone.Field.Types
const { imageType } = requireRoot('lib/helpers')

const WorkerProfile = new keystone.List('WorkerProfile', {
  // nocreate: true,
  // noedit: true,
  drilldown: 'user',
  label: 'Workers',
  track: true
})

WorkerProfile.add({
  user: { type: Types.Relationship, ref: 'SecurityUser', label: 'User', initial: true, required: true },
  intro: { type: Types.Textarea, trim: true, label: 'Intro', noedit: true, initial: true },
  currencies: { type: Types.Relationship, ref: 'Currency', label: 'Currencies', noedit: true, initial: true, many: true },
  pageBackgroundImage: imageType({ folder: 'images', label: 'Page Background', noedit: true }),
  pageBackground: { type: Types.Relationship, ref: 'Image', label: 'Page Background', noedit: true, initial: true, many: false },
  hourlyCharge: { type: String, required: true, initial: true },
  attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true }
})

WorkerProfile.add('Schedule', {
  schedule: {
    sun: { type: Boolean, initial: true, label: 'Sunday' },
    mon: { type: Boolean, initial: true, label: 'Monday' },
    tue: { type: Boolean, initial: true, label: 'Tuesday' },
    wed: { type: Boolean, initial: true, label: 'Wednesday' },
    thu: { type: Boolean, initial: true, label: 'Thursday' },
    fri: { type: Boolean, initial: true, label: 'Friday' },
    sat: { type: Boolean, initial: true, label: 'Saturday' }
  }
})

WorkerProfile.relationship({ path: 'socials', ref: 'WorkerSocial', refPath: 'worker' })

WorkerProfile.schema.virtual('socials', {
  ref: 'WorkerSocial',
  localField: '_id',
  foreignField: 'worker',
  justOne: false
})

WorkerProfile.relationship({ path: 'services', ref: 'WorkerService', refPath: 'worker' })

WorkerProfile.schema.virtual('services', {
  ref: 'WorkerService',
  localField: '_id',
  foreignField: 'worker',
  justOne: false
})

WorkerProfile.relationship({ path: 'employments', ref: 'WorkerEmployment', refPath: 'worker' })

WorkerProfile.schema.virtual('employments', {
  ref: 'WorkerEmployment',
  localField: '_id',
  foreignField: 'worker',
  justOne: false
})

WorkerProfile.schema.pre('save', async function (next) {
  if (this.pageBackground) {
    const Image = keystone.list('Image')
    const pageBackground = await Image.model.findOne({
      _id: this.pageBackground._id
    })
    this.pageBackgroundImage = pageBackground.image
  }
  next()
})

WorkerProfile.defaultColumns = 'user, createdAt'

WorkerProfile.register()
