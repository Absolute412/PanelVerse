const BASE_URL = "https://api.mangadex.org";

export const getChapterPages = async(chapterId) =>{
    const res = await fetch(`${BASE_URL}/at-home/server/${chapterId}`);
    const data = res.json();
    return data.chapter.data;
}
