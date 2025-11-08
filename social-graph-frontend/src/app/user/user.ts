export class User {

    constructor(
        public id: string,
        public name: string,
        public email: string,
        public bio: string,
        public avatarUrl: string,
        public role: string,
        public friends: User[]
    ) {}
}
