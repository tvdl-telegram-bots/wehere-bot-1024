const FIRST_NAMES = [
  ["Aguri", "Akemi", "Akiho", "Akimi", "Akira", "Amane", "Anri", "Aoi"],
  ["Asuka", "Ataru", "Chiaki", "Chihiro", "Fuku", "Fumiyo", "Hajime"],
  ["Haruka", "Harumi", "Hatsu", "Hayate", "Hazuki", "Hibiki", "Hide"],
  ["Hifumi", "Hikari", "Hikaru", "Hinata", "Hiromi", "Hiromu", "Hisaya"],
  ["Hotaru", "Ibara", "Ibuki", "Iori", "Isami", "Itsuki", "Izumi", "Jun"],
  ["Kaede", "Kagami", "Kairi", "Kakeru", "Kamui", "Kaname", "Kanata"],
  ["Kaoru", "Katsumi", "Kayo", "Kazumi", "Keiki", "Kirara", "Kohaku"],
  ["Kokoro", "Kou", "Kumi", "Kunie", "Kurumi", "Kyo", "Maki", "Makoto"],
  ["Manami", "Masaki", "Masami", "Masumi", "Matoi", "Michiru", "Michiyo"],
  ["Mikoto", "Minato", "Minori", "Mirai", "Misao", "Mitsue", "Mitsuki"],
  ["Mitsuru", "Mitsuyo", "Mizuho", "Mizuki", "Mukuro", "Mutsumi", "Nagisa"],
  ["Naomi", "Natsuki", "Natsuo", "Nozomi", "Oboro", "Rei", "Ren", "Reon"],
  ["Retsu", "Riku", "Rin", "Rio", "Rui", "Ryuko", "Sakae", "Sakuya", "Satori"],
  ["Satsuki", "Setsuna", "Shigeri", "Shiki", "Shima", "Shinobu", "Shion"],
  ["Shizu", "Sora", "Taiga", "Takami", "Takemi", "Tamaki", "Tatsuki"],
  ["Terumi", "Tomoe", "Tomomi", "Tomori", "Tori", "Toru", "Toshimi"],
  ["Towa", "Toyo", "Tsubasa", "Tsukasa", "Yakumo", "Yoshie", "Yoshika"],
  ["Yoshimi", "Yuki", "Yuma", "Yuri"],
].flat();

export function getUsername(userid: number) {
  return (
    FIRST_NAMES[userid % FIRST_NAMES.length] +
    ("000" + (userid % 1000)).slice(-3)
  );
}
