/// <reference path="snapchat.agent.ts" />
/// <reference path="snapchat.models.ts" />

namespace Snapchat {
    export class Client {
        private SnapchatAgent: Snapchat.Agent;

        public AllUpdatesData;
        public CurrentUser: Snapchat.User;

        public Initialize() {
            this.SnapchatAgent = new Snapchat.Agent();
            this.CurrentUser = new Snapchat.User();

            return new Promise((resolve) => {
                this.SnapchatAgent.Initialize(this.CurrentUser).then(function () {
                    resolve(this);
                });
            });
        }

        /*
            Get the current user's pending Snapchat feed
        */
        public GetPendingFeed(): Array<Snapchat.Snap> {
            let Snaps: Array<Snapchat.Snap> = [],
                friends = this.AllUpdatesData.conversations_response;

            for (var x = 0; x < friends.length; x++) {
                const snaps = friends[x].pending_received_snaps;
                for (var n = 0; n < snaps.length; n++) {
                    let snap = snaps[n],
                        sn = new Snapchat.Snap();

                    sn.conversationId = friends[x].id;
                    sn.id = snap.id;
                    sn.mediaType = snap.m;
                    sn.sender = snap.sn;
                    sn.recipient = snap.rp;
                    sn.mediaState = snap.st;
                    sn.timeSent = snap.sts;
                    sn.timer = snap.timer;
                    sn.timestamp = snap.ts;

                    Snaps.push(sn);
                }
            }
            Snaps.sort(function (a, b) {
                return a.timestamp - b.timestamp;
            });
            Snaps.reverse();
            return Snaps;
        }

        /*
            Get the media for the provided snap
        */
        public GetSnapMedia(snap: Snapchat.Snap) {
            let self = this,
                data = this.AllUpdatesData,
                timestamp = this.SnapchatAgent.GenerateTimeStamp();

            return new Promise((resolve) => {
                //stub
                resolve(this);
            });
        }

        /*
            Get a user's SnapTag
        */
        public GetSnapTag(username: string) {
            let self = this,
                data = this.AllUpdatesData,
                timestamp = this.SnapchatAgent.GenerateTimeStamp();

            return new Promise((resolve) => {
                //stub
                resolve(this);
            });
        }

        /*
            Log In a user
        */
        public Login(details: Snapchat.LoginDetails) {
            this.CurrentUser.username = details.username;
            this.CurrentUser.password = details.password;
            this.CurrentUser.google_username = null;
            this.CurrentUser.google_password = null;

            return new Promise((resolve) => {
                //stub
                resolve(this);
            });
        }

        /*
            Log Out a user
        */
        public Logout() {
            this.CurrentUser = null;

            return new Promise((resolve) => {
                //stub
                resolve(this);
            });
        }

        public PostSnap(URI, parameters, headers?) {
            return this.SnapchatAgent.PostSnapchat(URI, parameters, headers);
        }
    }
}
