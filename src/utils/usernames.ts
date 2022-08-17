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
  ["Yoshimi", "Yuki", "Yuma"],
].flat();

const LAST_NAMES = [
  ["Abe", "Aburami", "Adachi", "Agawa", "Aida", "Aikawa", "Aino", "Akabori"],
  ["Akaboshi", "Akai", "Akamatsu", "Akao", "Akashi", "Akeda", "Akita"],
  ["Akiyama", "Amaki", "Amakusa", "Amane", "Amano", "Amo", "Anami", "Aoyama"],
  ["Arahama", "Arai", "Arakaki", "Araki", "Aramaki", "Arata", "Arii"],
  ["Arioka", "Arita", "Asada", "Asagiri", "Asahina", "Asakura", "Asano"],
  ["Ashida", "Ashikaga", "Ayahara", "Ayano", "Baba", "Bai", "Banba"],
  ["Bandai", "Beppu", "Chano", "Daichi", "Daicho", "Daido", "Daigoho"],
  ["Daigoku", "Daijo", "Daiku", "Dainichi", "Daiwa", "Daiyo", "Dan"],
  ["Date", "Deguchi", "Deon", "Deura", "Deushi", "Deyama", "Dezaki"],
  ["Doiuchi", "Dokite", "Edogawa", "Eki", "Eku", "Enomoto", "Eto", "Ezura"],
  ["Fujimori", "Fujinaka", "Fujioka", "Fujisaki", "Fujiwara", "Fukuda"],
  ["Fukumoto", "Fukuyama", "Furukawa", "Futamata", "Gaiato", "Ganbe", "Gobu"],
  ["Godai", "Gorumba", "Goto", "Guionu", "Hagino", "Hagiwara", "Hakuta"],
  ["Hamamoto", "Hamanaka", "Hamasaki", "Hanabusa", "Hanamura", "Haneda"],
  ["Haruno", "Hasemi", "Haseyama", "Hashiri", "Hatano", "Hayakawa"],
  ["Hayasaka", "Hazuki", "Hibino", "Hidaka", "Higashi", "Hiiragi", "Hinata"],
  ["Hirai", "Hirano", "Hirota", "Honda", "Honma", "Horie", "Horii"],
  ["Horikawa", "Horiuchi", "Hoshide", "Hosokawa", "Hosonuma", "Ichikawa"],
  ["Ichimura", "Ichinose", "Ide", "Ifukube", "Igawa", "Iguchi", "Iida"],
  ["Ikeda", "Ikemizu", "Ikenami", "Ikusaba", "Imagawa", "Imakake", "Imoto"],
  ["Inaba", "Inada", "Inoue", "Inukai", "Ioki", "Ishida", "Ishiguro"],
  ["Ishii", "Ishiki", "Ishimori", "Ishimura", "Ishiyama", "Ishizaki"],
  ["Isobe", "Isono", "Itagaki", "Iwai", "Iwaki", "Iwakura", "Iwamoto"],
  ["Izumi", "Jakushi", "Jihara", "Jikihara", "Jinmei", "Jinnai", "Jinnaka"],
  ["Jogo", "Jonouchi", "Junpei", "Kagura", "Kaiba", "Kaito", "Kajiura"],
  ["Kaku", "Kamiya", "Kanai", "Kanan", "Kanayama", "Kaneda", "Kanegai"],
  ["Kanemoto", "Kaneyama", "Kanno", "Kanzaki", "Karasuma", "Kashima"],
  ["Kashino", "Kasuga", "Katayama", "Katono", "Kawakami", "Kawamori"],
  ["Kawamura", "Kawarage", "Kawasaki", "Kayano", "Kenmochi", "Kichida"],
  ["Kikkawa", "Kikuchi", "Kimoto", "Kimura", "Kinomoto", "Kishida"],
  ["Kishino", "Kitagawa", "Kitamura", "Kitani", "Kitano", "Kitaoka"],
  ["Kobe", "Koda", "Kogo", "Koike", "Koiwai", "Koizumi", "Kokaji"],
  ["Komamura", "Komatsu", "Komiya", "Konami", "Kondo", "Konno", "Kosaka"],
  ["Koshiba", "Koshino", "Koyama", "Kumagai", "Kumakubo", "Kume", "Kumiko"],
  ["Kumode", "Kumon", "Kuramoto", "Kuraya", "Kurita", "Kuroi", "Kuroki"],
  ["Kurono", "Kurosaki", "Kuwabara", "Maaka", "Maebara", "Maeda", "Mamiya"],
  ["Masamoto", "Matsuda", "Matsui", "Matsuoka", "Matsuura", "Mazakada"],
  ["Mazaki", "Meichi", "Mihama", "Miki", "Minamoto", "Mineto", "Miura"],
  ["Miyagi", "Miyahara", "Miyahira", "Miyasawa", "Miyazaki", "Miyazawa"],
  ["Mizorogi", "Mizuhara", "Monden", "Morihara", "Morimoto", "Morinaka"],
  ["Morioka", "Morita", "Murakami", "Muramaru", "Muramoto", "Muranaka"],
  ["Muraoka", "Murayama", "Myoui", "Nagai", "Nagasaki", "Nagata", "Nagato"],
  ["Naito", "Nakagawa", "Nakajima", "Nakamoto", "Nakamura", "Nakano"],
  ["Nakatani", "Nakayama", "Namatame", "Nara", "Narusawa", "Nekotani"],
  ["Nezu", "Niidome", "Niimi", "Nikaido", "Ninomiya", "Nishioka", "Nitta"],
  ["Noda", "Nogami", "Nomura", "Nozawa", "Nozomi", "Obara", "Obata", "Ochiai"],
  ["Oda", "Ode", "Ogata", "Ogawa", "Ogiwara", "Oguri", "Oguro", "Oide"],
  ["Oikawa", "Oishi", "Okabe", "Okada", "Okajima", "Okamoto", "Okamura"],
  ["Okano", "Okayama", "Okazaki", "Okimoto", "Okubo", "Okuda", "Okumura"],
  ["Okuyama", "Omi", "Omura", "Onishi", "Onizuka", "Onouye", "Orido"],
  ["Oshii", "Oshima", "Otake", "Otsuka", "Oyama", "Ozikawa", "Rakuyama"],
  ["Reizei", "Rikiishi", "Rikitake", "Rin", "Rokuda", "Rokuhara", "Royama"],
  ["Sada", "Sagara", "Sage", "Sakamaki", "Sakamoto", "Sakata", "Sakuragi"],
  ["Sakurai", "Sannai", "Sano", "Sanuki", "Sasahara", "Sawamura", "Seino"],
  ["Sekimoto", "Senda", "Seriou", "Seta", "Seto", "Shibata", "Shida"],
  ["Shimada", "Shimazu", "Shimizu", "Shimodoi", "Shimura", "Shinjo"],
  ["Shinseki", "Shintani", "Shizuka", "Shizuki", "Shoji", "Shureno"],
  ["Shutou", "Sonoda", "Sudo", "Sugawara", "Sugihara", "Sugimoto"],
  ["Sugiyama", "Sugo", "Suwa", "Suzukawa", "Taira", "Takada", "Takagi"],
  ["Takamoto", "Takamura", "Takano", "Takaoka", "Takashi", "Takasu"],
  ["Takayama", "Takechi", "Takeda", "Takei", "Takemoto", "Tamiya", "Tamura"],
  ["Tanimoto", "Tanizaki", "Tebi", "Terada", "Terauchi", "Tezuka", "Toguchi"],
  ["Tomada", "Tominaga", "Tominaka", "Toriyama", "Toshima", "Toyoda"],
  ["Tsubasa", "Tsubata", "Tsuchiya", "Tsuda", "Tsuji", "Tsunoda", "Tsushiro"],
  ["Tsutsui", "Tsutsuji", "Ubagai", "Ubai", "Uchibori", "Uchihara"],
  ["Uchino", "Uchiyama", "Udagawa", "Ueda", "Uematsu", "Ueno", "Uenuma"],
  ["Ueo", "Ueshiba", "Uesugi", "Umemiya", "Umemori", "Umemoto", "Umetsu"],
  ["Uno", "Uotani", "Usuda", "Usui", "Utsubo", "Uyama", "Uzuhara", "Uzumaki"],
  ["Wada", "Wakahisa", "Wakamiya", "Wakamoto", "Wakayama", "Waki", "Watabe"],
  ["Watanabe", "Watoga", "Wauke", "Yabuki", "Yada", "Yagami", "Yajima"],
  ["Yakamoto", "Yamada", "Yamagata", "Yamagoe", "Yamamiya", "Yamamura"],
  ["Yamanaka", "Yamane", "Yamaoka", "Yamasaki", "Yamato", "Yamauchi"],
  ["Yamazawa", "Yanagi", "Yanase", "Yano", "Yasuda", "Yatabe", "Yofu"],
  ["Yokomine", "Yokomoto", "Yokoyama", "Yomoda", "Yonamine", "Yoneda"],
  ["Yonemura", "Yoshida", "Yoshii", "Yoshioka", "Yotsuya", "Yuito"],
  ["Yukimoto", "Yukimura", "Yumigano", "Zaan", "Zenitani", "Zeniya", "Zentani"],
].flat();

function divmod(a: number, b: number): [number, number] {
  const r = a % b;
  const q = (a - r) / b;
  return [q, r];
}

export function getUsername(userid: number) {
  console.log({ userid });
  if (!isFinite(userid)) return undefined;
  const [xy, z] = divmod(userid, FIRST_NAMES.length);
  const [x, y] = divmod(xy, LAST_NAMES.length);
  return FIRST_NAMES[z] + LAST_NAMES[y] + x;
}

export function getUserid(username: string) {
  const match = /^([A-Z][a-z]*)([A-Z][a-z]*)([0-9]+)$/.exec(username);
  if (!match) return undefined;
  const [_, zz, yy, xx] = match;
  const z = FIRST_NAMES.indexOf(zz);
  const y = LAST_NAMES.indexOf(yy);
  const x = parseInt(xx);
  if (isNaN(x) || !y || !z) return undefined;
  return (x * LAST_NAMES.length + y) * FIRST_NAMES.length + z;
}
