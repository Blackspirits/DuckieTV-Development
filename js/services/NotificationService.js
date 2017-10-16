/** 
 * The notification service can create Chrome Notifications to notify users of aired episodes.
 * Currently still needs to be implemented by hooking into the AutoDownloadService
 */
DuckieTV.factory("NotificationService", ["SettingsService", function(SettingsService) {
    var ids = {}; // track existing notifications

    /** 
     * Create a Chrome Notification
     */
    var create = function(options, callback) {
        if (!SettingsService.get('notifications.enabled')) {
            return;
        }
        var id = 'seriesguide_' + new Date().getTime();
        ids[id] = options;
        var notification = chrome.notifications.create(id, options, callback || function() {});
    }


    return {
        /** 
         * Create a basic notification with the duckietv icon
         */
        notify: function(title, message, callback) {
            create({
                type: "basic",
                title: title,
                message: message,
                iconUrl: "img/logo/icon64.png"
            }, callback);
            var soundPlayed = false;
            playSound = function(key, useDefault) {
                useDefault = useDefault || false;
                switch(key) {
                    case "Torrent":
                        var audio = new Audio('tada.wav');
                        audio.play();
                        soundPlayed = true;
                        break;
                    case "Download":
                        var audio = new Audio('Exclamation.wav');
                        audio.play();
                        soundPlayed = true;
                        break;
                    default:
                        if (useDefault) {
                            var audio = new Audio('notify.wav');
                            audio.play();
                            soundPlayed = true;
                        }
                }
            }
            playSound(message.split(' ')[0]);
            if (!soundPlayed) {
                playSound(title.split(' ')[0], true);
            }
        },
        /** 
         * Create a notification of the type 'list' with the DuckieTV icon
         */
        list: function(title, message, items, callback) {
            create({
                type: "list",
                title: title,
                message: message,
                iconUrl: "img/logo/icon64.png",
                items: items
            });
        }

    };

}])