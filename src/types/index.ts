import { z } from "zod"

/** TYPE AUTH && USERS  */

const authSchema = z.object({
    userName: z.string(),
    email: z.string(),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})
type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email'|'password'>
export type UserRegistrationForm = Pick<Auth, 'userName'|'email'|'password'|'password_confirmation'>
export type ConfirmToken = Pick<Auth, 'token'>
export type RequestConfirmationCodeForm = Pick<Auth, "email">
export type ForgotPasswordForm = Pick<Auth, "email">
export type NewPasswordForm = Pick<Auth, "password"|"password_confirmation">
export type ChangeCurrentPassword = Pick<Auth, "current_password"|"password"|"password_confirmation">
export type CheckPasswordForm = Pick<Auth, 'password'>


/** TYPE USER  */
export const userSchema = authSchema.pick({
    userName: true,
    email: true
}).extend({
    _id: z.string()
})
export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User, 'userName'|'email'>


/** TYPE NOTE  */
export const noteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    createdBy: userSchema,
    task: z.string(),
    createdAt: z.string()
})
export type Note = z.infer<typeof noteSchema>
export type NoteForm = Pick<Note, "content">



/** TYPE TAREA  */
export const taskStatusSchema = z.enum(["pending", "onHold", "inProgress", "underReview", "completed"])
export const taskSchema = z.object({
    _id: z.string(),
    taskName: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
    completedBy: z.array(z.object({
        _id: z.string(),
        user: userSchema,
        status: taskStatusSchema
    })),
    notes: z.array(noteSchema.extend({
        createdBy: userSchema
    }))
})
export const taskProjectSchema = taskSchema.pick({
    _id: true,
    taskName: true,
    description: true,
    status: true
})

export type Task = z.infer<typeof taskSchema>
export type TaskStatus = z.infer<typeof taskStatusSchema>
export type TaskFormData = Pick<Task, 'taskName'|'description'>
export type TaskProject = z.infer<typeof taskProjectSchema>


/** TEAM */
const teamMemberSchema = userSchema.pick({
    userName: true,
    email: true,
    _id: true
})
export const teamMembersSchema = z.array(teamMemberSchema)

export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, "email">


/** TYPE PROYECTO  */
export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(userSchema.pick({_id: true})),
    tasks: z.array(taskProjectSchema),
    team: z.array(z.string(userSchema.pick({_id: true})))

})
export const dashboardProjectsSchema = z.array(projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true
    })
)
export const editProjectSchema = projectSchema.pick({
    projectName: true,
    clientName: true,
    description: true   
})

export type Project = z.infer<typeof projectSchema>
// Pick crea un typo con lo que seleccionamos 
export type ProjectFormData = Pick<Project, 'projectName'|'clientName'|'description'>

