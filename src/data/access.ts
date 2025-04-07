import access1 from '../assets/access/access1.png';
import access2 from '../assets/access/access2.png';
import access3 from '../assets/access/access3.png';
import access4 from '../assets/access/access4.png';

export type AccessData = {
    image: ImageMetadata;
    description: string;
    id: number;
}

export const accessList: AccessData[] = [
    {image: access1, description:"① みんな大好き丸池です", id: 1},
    {image: access2, description:"② 丸池の南側の道です。この道をちょっと進むと三枚目の写真の建物が左手に見えてきます", id: 2},
    {image: access3, description:"③ この建物の中庭的スペースに入ります", id: 3},
    {image: access4, description:"④ 正面に見えるのが写真研究会の部室です", id: 4},
];