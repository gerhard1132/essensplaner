
const allFoodTypes = ["breakfast", "lunch", "dinner", "snack"]
const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

let finalObj = {}
let finalList = []

export default function getList(Plan) {
    finalObj = {}
    finalList = []
    allDays.forEach(day => {
        let foundDay = Plan.find(item => item.name == day)
        allFoodTypes.forEach(food => {
            //console.log(foundDay[food].$.NAME)
            if (foundDay[food].$.NAME != "+") {
                try {
                    foundDay[food].item.forEach(elem => {
                        if (!finalObj[elem.$.NAME]) {
                            finalObj[elem.$.NAME] = {"typ": elem.$.TYP, "amount": parseInt(elem.$.NUM)}
                        } else {
                            if (finalObj[elem.$.NAME].typ == elem.$.TYP) {
                                finalObj[elem.$.NAME].amount += parseInt(elem.$.NUM)
                            } else {
                                console.log("Error: ", elem)}
                        }
                    })
                }
                catch {
                    if (!finalObj[foundDay[food].$.NAME + "'"]) {
                        finalObj[foundDay[food].$.NAME + "'"] = 1
                    } else {
                        finalObj[foundDay[food].$.NAME + "'"] += 1
                    }
                }
            }
        })
    })
    for (let name in finalObj) {
        //console.log(finalObj[name], name, finalObj[name].typ)
        switch (finalObj[name].typ) {
            case "G":
                finalList.push(String(finalObj[name].amount) + "g " + name)
                break
            case "L":
                finalList.push(String(finalObj[name].amount) + "ml " + name)
                break
            case "N":
                finalList.push(String(finalObj[name].amount) + "x " + name)
                break
            default:
                finalList.push(String(finalObj[name]) + "x " + name)
                console.log("SpecialCase activated! (for:", name, ", ", finalObj[name], ")")
                break
        }
    }
    return finalList
}