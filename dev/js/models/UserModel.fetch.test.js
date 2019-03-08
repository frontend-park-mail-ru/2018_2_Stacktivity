import UserModel from "./UserModel";
import Emitter from "../modules/Emitter";
import AjaxModule from "../modules/Ajax";

jest.mock('../modules/Ajax');

describe('UserModel: fetch', () => {
    it('should emit done-get-user: alerady storing user data', async (done) => {
        Emitter.on("done-get-user", () => {
            done();
        }); // after event emit callback is called

        const user = new UserModel(true);
        user._data = {username: "Del-Vey"};
        await user.fetch();
    });

    it('should emit done-get-user: already know that not logged in', async (done) => {
        Emitter.on("done-get-user", () => {
            done();
        }); // after event emit callback is called

        const user = new UserModel(true);
        user._data = {is_logged_in: false};
        await user.fetch();
    });

    it('should emit check-user-login', async (done) => {
        Emitter.on("check-user-login", () => {
            done();
        }); // after event emit callback is called

        const user = new UserModel(true);
        await user.fetch();
    });

    it('should emit error', async (done) => {
        const user = new UserModel(true);
        user._data = {is_logged_in: true, id: 1};

        Emitter.on("error", () => {
            done();
        }); // after event emit callback is called

        const resp = {
            status: 500,
        };
        AjaxModule.doGet.mockResolvedValueOnce(resp);

        await user.fetch();
    });

    it('should set fields of _data up (status 200)', async () => {
        expect.hasAssertions();

        const user = new UserModel(true);
        user._data = {is_logged_in: true, id: 1};

        const doneGetUser = "done-get-user-new-data";

        Emitter.on(doneGetUser, () => {
            expect(user._data).
                toEqual(data); // strict equality is not required
        });

        const data = {username: "truncate table", email: "@.@"};
        const resp = {
            status: 200,
            json: () => Promise.resolve(data),
        };

        AjaxModule.doGet.mockResolvedValueOnce(resp);
        await user.fetch({doneGetUser});
    });
});