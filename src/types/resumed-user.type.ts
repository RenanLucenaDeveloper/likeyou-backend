import { UUID } from "crypto"

export type ResumedUserType = {
    id: UUID,
    name: string,
    description: string,
    profileImage: string,
    feedbacks: {likes: number, dislikes: number}
}