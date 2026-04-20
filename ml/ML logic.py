import joblib
import numpy as np
from sklearn.ensemble import IsolationForest

# Features: [clock_in_time, device_sharing_flag, frequency_score]
# clock_in_time: seconds from midnight / (24*3600)
# device_sharing_flag: 0 or 1
# frequency_score: 0 to 1

# Generate some "Normal" training data
# Usually students clock in around 8 AM (0.33) to 9 AM (0.37)
normal_data = []
for _ in range(100):
    time = np.random.normal(0.35, 0.02)
    device = 0
    freq = np.random.normal(0.5, 0.1)
    normal_data.append([time, device, freq])

X = np.array(normal_data)

# Train the Anomaly Detection Model
# contamination=0.05 means we expect 5% of data to be "suspicious"
model = IsolationForest(contamination=0.05, random_state=42)
model.fit(X)

# Save the model to the backend folder
joblib.dump(model, "../attendance-system backend/attendance_model.pkl")
print("Model trained and saved to attendance_model.pkl")
