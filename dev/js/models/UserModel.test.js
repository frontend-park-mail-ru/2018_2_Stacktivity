import UserModel from "./UserModel";
import Emitter from "../modules/Emitter";

const user = UserModel;

describe('UserModel: isLoggedIn', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('actualy logged in', () => {
        Emitter.on("done-check-user-login", () => {
            expect(user.__data.is_logged_in).
                toEqual(true);
        });

        fetch.mockResponseOnce(JSON.stringify({ID: 1}), {status: 200});
        user.isLoggedIn();
    });

    it('not actualy logged in', () => {
        Emitter.on("done-check-user-login", () => {
            expect(user.__data.is_logged_in).
                toEqual(false);
        });

        fetch.mockResponseOnce(JSON.stringify({ID: 1}), {status: 401});
        user.isLoggedIn();
    });
});

describe('UserModel: update', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('valid update', () => {
        Emitter.on("update-success", (resp) => {
            expect(resp.status).
                toEqual(200);
        });
        fetch.mockResponseOnce(JSON.stringify({}), {status: 200});
        user.update({username: "lala"});
    });

    it('error on update', () => {
        Emitter.on("update-error", (resp) => {
            expect(resp.status).
                not.
                toEqual(200);
        });
        fetch.mockResponseOnce(JSON.stringify({}), {status: 401});
        user.update({username: "lala"});
    });
});

