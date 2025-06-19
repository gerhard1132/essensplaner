from flask import Flask, jsonify, request
from flask_cors import CORS
from waitress import serve

from processor import get_rand_food, get_rand_day, get_rand_week, get_all_foods, get_current_plan


ALL_FOOD_TYPES = ["breakfast", "lunch", "dinner", "snack"]
ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


app = Flask(__name__)
CORS(app)

@app.route("/api/generatePlan", methods=['GET'])
def generate_plan():
    try:
        week = get_rand_week()
        return jsonify(week)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/generateMeal", methods=['GET'])
def generate_meal():
    food_type = request.args.get('type', 'lunch')  # default to lunch
    try:
        food = get_rand_food(food_type)
        return jsonify({food_type: food})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/savePlan", methods=['POST'])
def save_plan():
    plan_data = request.json
    # Here you'd typically save to file or DB
    return jsonify({"message": "Plan saved successfully", "data": plan_data})


@app.route("/api/getSavedPlan", methods=['GET'])
def get_saved_plan():
    shopping_list = ["Eggs", "Dogs"]
    data = {"sendList": shopping_list,
            "sendPlan": get_current_plan()}
    return jsonify(data)


@app.route("/api/getAllFoods", methods=['GET'])
def get_all_foods_api():
    try:
        types = get_all_foods()
        return jsonify(types)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    serve(app, host="0.0.0.0", port=5000)
