import { pageView } from "../models/pageViewServer"
import { formatDate } from "./formatKoreanDate"


export const viewFinder = async(category: String) => { //1 = family, 2 = children ...
    const now = new Date();
    const nowTime = formatDate(now);
    const today = await pageView.findOne({
        "today": `${nowTime}`
      });

    if(!today) {
        await pageView.create({
            today: `${nowTime}`,
            '9': 0,
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0
        });
    };
        pageView.findOneAndUpdate(
            { 
                today: `${nowTime}`
            },
            {
                $inc: {
                    [`${category}`]: 1
                }
            }
        )
        .then (() => {
            return true;
        })
        .catch()
    }