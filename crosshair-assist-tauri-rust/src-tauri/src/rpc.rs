use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use std::error::Error;
use chrono;

use std::thread;
use std::time::Duration;
pub fn start() -> Result<(), Box<dyn Error>> {
    let mut client = DiscordIpcClient::new("886014861153280040")?;
    client.connect().unwrap();
    let start_at = chrono::Utc::now().timestamp().try_into()?;

    let activity = activity::Activity::new()
        .state("Societyg Software")
        .assets(
            activity::Assets::new()
                .large_image("https://pngimg.com/uploads/aim/aim_PNG42.png")
        )
        .timestamps(activity::Timestamps::new()
                .start(start_at))
        .buttons(vec![activity::Button::new(
            "Download now",
            "https://github.com/AroliSG/crosshair-assist/releases",
        )]);
    client.set_activity(activity)?;

    //thread::sleep(Duration::from_millis(1000));
    Ok(())
}