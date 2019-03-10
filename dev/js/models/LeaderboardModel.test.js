import Emitter from "../modules/Emitter";
import AjaxModule from "../modules/Ajax";
import LeaderboardModel from "./LeaderboardModel.js";

jest.mock('../modules/Ajax');

describe('LeaderboardModel: loadUsers', () => {
    it('should emit done-leaderboard-fetch on status 200', async (done) => {
        Emitter.on("done-leaderboard-fetch", () => {
            done();
        });

        const leaderboard = new LeaderboardModel();
        const page = 0;
        const resp = {
            status: 200,
            json: () => Promise.resolve({}),
        };

        AjaxModule.doGet.mockResolvedValueOnce(resp);
        await leaderboard.loadUsers(page);
    });

    it('should emit leaderboard-error on status 500', async (done) => {
        Emitter.on("leaderboard-error", () => {
            done();
        });

        const leaderboard = new LeaderboardModel();
        const page = 0;
        const resp = {
            status: 500,
        };

        AjaxModule.doGet.mockResolvedValueOnce(resp);
        await leaderboard.loadUsers(page);
    });
});