import {UserModel} from "./UserModel"
import {Emitter} from "../modules/Emitter";

describe('UserModel: isLoggedIn', () => {
    before(() => {
        this.user = new UserModel;
    });

    beforeEach(() => {
        fetch.resetMocks();
    });

    it('actualy logged in', async () => {
        Emitter.on("done-check-user-login", () => {
            expect(UserModel.__data.is_logged_in).toEqual(true);
        });
        fetch.mockResponseOnce(JSON.stringify({ ID: 1 }), { status: 200 });
        UserModel.isLoggedIn();
    });

    it('not actualy logged in', async () => {
        Emitter.on("done-check-user-login", () => {
            expect(UserModel.__data.is_logged_in).toEqual(false);
        });
        fetch.mockResponseOnce(JSON.stringify({ ID: 1 }), { status: 401 });
        UserModel.isLoggedIn();
    });
});

describe('UserModel: update', () => {
    before(() => {
        this.user = new UserModel;
    });

    beforeEach(() => {
        fetch.resetMocks();
    });

    it('valid update', async () => {
        Emitter.on("update-success", (resp) => {
            expect(resp.status).toEqual(200);
        });
        fetch.mockResponseOnce(JSON.stringify({}), { status: 200 });
        UserModel.update({ username: "lala" });
    });

    it('error on update', async () => {
        Emitter.on("update-error", (resp) => {
            expect(resp.status).not.toEqual(200);
        });
        fetch.mockResponseOnce(JSON.stringify({}), { status: 401 });
        UserModel.update({ username: "lala" });
    });
});

