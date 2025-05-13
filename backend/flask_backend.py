
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from waitress import serve


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/api/status", methods=['GET'])
def status():
    global currently_running
    output_file_names = get_current_outputs()
    return jsonify({"status": currently_running, "heading": "Running" if currently_running == "running" else "", "message": "", "logs": None, "files": output_file_names})


@app.route("/api/upload", methods=['POST'])
def upload():
    global currently_running
    
    # Check if input file even uploaded
    if "file" not in request.files:
        return jsonify({"status": currently_running, "heading": "Error", "message": "No file uploaded", "files": get_current_outputs()})
    
    if currently_running == "running":
        return jsonify({"status": currently_running, "heading": "Running", "message": "Process already running! Try again later.", "files": get_current_outputs()})
    
    # Reset folders (Todo: Reset zipfiles)
    for file in glob.iglob('../tmp/**/*', recursive=True):
        if file.endswith(('.xlsx', '.csv')):
            os.remove(file)

    # Save xlsx files
    file = request.files["file"]
    file.save(os.path.join(upload_folder, file.filename))
    
    currently_running = "running"

    # Run docker execution
    response = main()
    if response["status"] == "error":
        currently_running = "idle"
        response["files"] = get_current_outputs()
        print("\n\n", response, "\n\n")
        return jsonify(response)
    
    # Return success
    currently_running = "idle"
    return jsonify({"status": currently_running, "heading": "Success!", "message": "Hugo, Dorothe and Hugo evaluated successfully!", "files": get_current_outputs()})


@app.route("/api/download_results", methods=['GET'])
def get_results():
    zip_filename = f"AI_results_{time.strftime('%Y-%m-%d_%H-%M-%S')}.zip"
    zip_path = os.path.join(zipFolder, zip_filename)  

    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for folder in [output_folder_hugo, output_folder_dorothe]:
            for file in os.listdir(folder):
                if file.endswith(".xlsx"):
                    full_path = os.path.join(folder, file)  
                    
                    with open(full_path, "rb") as f:
                        zipf.writestr(file, f.read())  

    return send_file(zip_path, as_attachment=True, mimetype='application/zip')


# Supporting functions
def get_current_outputs():
    files = []
    for folder in [output_folder_hugo, output_folder_dorothe]:
            for file in os.listdir(folder):
                if file.endswith('.xlsx'):
                    files.append(file)
    return files


if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5000, debug=True)
    serve(app, host="0.0.0.0", port=5000)