import xml.etree.ElementTree as ET
import random
import os


DB_PATH = './data/Essen.xml'
CURRENT_PLAN = "./data/currentPlan.xml"
SHOPPING_LIST = ""

all_meal_types = ["breakfast", "lunch", "dinner", "snack"]


def parse_xml(path):
    if not os.path.exists(path):
        raise FileNotFoundError("XML database not found.")
    tree = ET.parse(path)
    return tree.getroot()


def get_rand_food(food_type):
    root = parse_xml(DB_PATH)
    meal_type = root.find(food_type)
    meal_list = meal_type.findall('food')
    chosen_food = random.choice(meal_list)
    item_list = [item.get("NAME") for item in chosen_food[:]] if chosen_food[:] else []
    return {"NAME": chosen_food.get("NAME"), "ITEMS": item_list}


def get_rand_day():
    day = {}
    for food_type in all_meal_types:
        day[food_type] = get_rand_food(food_type)
    return day


def get_rand_week():
    final_plan = []
    for _ in range(7):
        final_plan.append(get_rand_day())
    print(final_plan)
    return final_plan


def get_all_foods():
    root = parse_xml(DB_PATH)
    data = {}
    
    for meal_type in root:
        type_list = []
        for food in meal_type:
            item_list = []
            if food[:]:
                for item in food:
                    item_list.append(item.get("NAME"))
            type_list.append({"NAME": food.get("NAME"), "ITEMS": item_list})
        data[meal_type.tag] = type_list
    return data

def get_current_plan():
    root = parse_xml(CURRENT_PLAN)
    final_list = []
    
    for day in root:
        current_day = {}
        for meal_type in day:
            item_list = []
            if meal_type[:]:
                for item in meal_type:
                    item_list.append(item.get("NAME"))
            current_day[meal_type.tag] = {"NAME": meal_type.get("NAME"), "ITEMS": item_list}
        final_list.append(current_day)
    return final_list