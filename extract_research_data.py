import json
import csv
import os
import shutil

os.makedirs('src/data', exist_ok=True)
os.makedirs('public/samples', exist_ok=True)

# 1. Load multitask metrics
with open('pm_results/pm_research/results/multitask_metrics.json', 'r') as f:
    multitask_metrics = json.load(f)

# 2. Load multitask info
with open('pm_results/pm_research/multitask/info.json', 'r') as f:
    multitask_info = json.load(f)

# 3. Load baseline table
def read_csv(path):
    with open(path, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f))

baseline_table = read_csv('pm_results/pm_research/results/baseline_table.csv')
ablation_table = read_csv('pm_results/pm_research/results/ablation_table.csv')
original_vs_improved = read_csv('pm_results/pm_research/results/original_vs_improved_vs_benchmark.csv')
history = read_csv('pm_results/pm_research/multitask/history.csv')

# 4. Load test predictions summary and curated test samples
test_rows = read_csv('pm_results/pm_research/multitask/test_predictions.csv')

# Dataset summary statistics
stats = {
    "total_test_samples": len(test_rows),
    "datasets": {},
    "pm_positive_count": 0,
    "pm_negative_count": 0,
    "severity_counts": {"0": 0, "1": 0, "2": 0, "3": 0, "4": 0},
    "has_fovea_count": 0,
    "has_lc_count": 0,
    "has_fs_count": 0,
    "has_disc_count": 0,
}

for r in test_rows:
    ds = r.get('dataset', 'Unknown')
    stats['datasets'][ds] = stats['datasets'].get(ds, 0) + 1
    prob = float(r.get('pm_prob', 0) or 0)
    if prob >= 0.5:
        stats['pm_positive_count'] += 1
    else:
        stats['pm_negative_count'] += 1
    sev = r.get('sev_pred', '')
    if sev in stats['severity_counts']:
        stats['severity_counts'][sev] += 1
    if r.get('fovea_err_px'):
        stats['has_fovea_count'] += 1
    if float(r.get('lesion_lc_pred_area_px', 0) or 0) > 0:
        stats['has_lc_count'] += 1
    if float(r.get('lesion_fs_pred_area_px', 0) or 0) > 0:
        stats['has_fs_count'] += 1
    if r.get('dice_disc'):
        stats['has_disc_count'] += 1

# Select top diverse sample cases from test set representing varied real clinical presentations
curated_samples = []
# Pick 2 from PALM (TP and TN), 2 from MMAC (severe and mild), 1 from HRF-Seg+
palm_tp = [r for r in test_rows if r.get('dataset') == 'PALM' and float(r.get('pm_prob', 0)) > 0.95 and r.get('pm_label') == '1.0']
palm_tn = [r for r in test_rows if r.get('dataset') == 'PALM' and float(r.get('pm_prob', 0)) < 0.05 and r.get('pm_label') == '0.0']
mmac_high = [r for r in test_rows if r.get('dataset') == 'MMAC2023' and r.get('sev_pred') == '4']
mmac_mid = [r for r in test_rows if r.get('dataset') == 'MMAC2023' and r.get('sev_pred') == '2']
mmac_low = [r for r in test_rows if r.get('dataset') == 'MMAC2023' and r.get('sev_pred') == '0']
hrf_disc = [r for r in test_rows if r.get('dataset') == 'HRF-Seg+']

curated = []
if palm_tp: curated.append((palm_tp[0], "PALM High-Probability PM with Lacquer Cracks & Fuchs Spot Lesions", "PALM-TP-01"))
if palm_tn: curated.append((palm_tn[0], "PALM Non-PM Control Fundus (Normal Retinal Architecture)", "PALM-TN-01"))
if mmac_high: curated.append((mmac_high[0], "MMAC 2023 Severe Myopic Maculopathy (Category 4 Macular Atrophy)", "MMAC-SEV4-01"))
if mmac_mid: curated.append((mmac_mid[0], "MMAC 2023 Diffuse Chorioretinal Atrophy (Category 2)", "MMAC-SEV2-01"))
if mmac_low: curated.append((mmac_low[0], "MMAC 2023 Tessellated Fundus / Category 0 (No PM lesions)", "MMAC-SEV0-01"))
if hrf_disc: curated.append((hrf_disc[0], "HRF-Seg+ Optic Disc Segmentation Benchmark Case", "HRF-DISC-01"))

formatted_samples = []
for row, title, sample_id in curated:
    formatted_samples.append({
        "sampleId": sample_id,
        "title": title,
        "uid": row.get('uid', ''),
        "dataset": row.get('dataset', ''),
        "pmProbability": float(row.get('pm_prob', 0) or 0),
        "pmLabel": row.get('pm_label') if row.get('pm_label') else None,
        "severityPred": int(row.get('sev_pred')) if row.get('sev_pred') != '' else None,
        "foveaPred": {
            "x": float(row.get('fovea_x_pred', 0) or 0),
            "y": float(row.get('fovea_y_pred', 0) or 0),
            "errPx": float(row.get('fovea_err_px')) if row.get('fovea_err_px') else None
        } if row.get('fovea_x_pred') else None,
        "quantification": {
            "lesionLc": {
                "predAreaPx": float(row.get('lesion_lc_pred_area_px', 0) or 0),
                "predPctFundus": float(row.get('lesion_lc_pred_pct_fundus', 0) or 0),
                "macularAreaPx": float(row.get('lesion_lc_pred_macular_area_px', 0) or 0),
                "macularDensity": float(row.get('lesion_lc_pred_macular_density', 0) or 0),
                "meanDistDiscDd": float(row.get('lesion_lc_pred_mean_dist_disc_dd')) if row.get('lesion_lc_pred_mean_dist_disc_dd') else None,
                "meanDistFoveaDd": float(row.get('lesion_lc_pred_mean_dist_fovea_dd')) if row.get('lesion_lc_pred_mean_dist_fovea_dd') else None,
                "quadrants": [
                    float(row.get('lesion_lc_pred_quadrant0_share', 0) or 0),
                    float(row.get('lesion_lc_pred_quadrant1_share', 0) or 0),
                    float(row.get('lesion_lc_pred_quadrant2_share', 0) or 0),
                    float(row.get('lesion_lc_pred_quadrant3_share', 0) or 0)
                ]
            },
            "lesionFs": {
                "predAreaPx": float(row.get('lesion_fs_pred_area_px', 0) or 0),
                "predPctFundus": float(row.get('lesion_fs_pred_pct_fundus', 0) or 0),
                "macularAreaPx": float(row.get('lesion_fs_pred_macular_area_px', 0) or 0),
                "macularDensity": float(row.get('lesion_fs_pred_macular_density', 0) or 0),
                "meanDistDiscDd": float(row.get('lesion_fs_pred_mean_dist_disc_dd')) if row.get('lesion_fs_pred_mean_dist_disc_dd') else None,
                "meanDistFoveaDd": float(row.get('lesion_fs_pred_mean_dist_fovea_dd')) if row.get('lesion_fs_pred_mean_dist_fovea_dd') else None,
                "quadrants": [
                    float(row.get('lesion_fs_pred_quadrant0_share', 0) or 0),
                    float(row.get('lesion_fs_pred_quadrant1_share', 0) or 0),
                    float(row.get('lesion_fs_pred_quadrant2_share', 0) or 0),
                    float(row.get('lesion_fs_pred_quadrant3_share', 0) or 0)
                ]
            }
        },
        "dice": {
            "disc": float(row.get('dice_disc')) if row.get('dice_disc') else None,
            "lesionLc": float(row.get('dice_lesion_lc')) if row.get('dice_lesion_lc') else None,
            "lesionFs": float(row.get('dice_lesion_fs')) if row.get('dice_lesion_fs') else None,
        }
    })

dataset_export = {
    "multitask_metrics": multitask_metrics,
    "multitask_info": multitask_info,
    "baseline_table": baseline_table,
    "ablation_table": ablation_table,
    "original_vs_improved": original_vs_improved,
    "training_history": history,
    "test_summary": stats,
    "curated_samples": formatted_samples,
    # Include 50 random test rows for client-side search and filtering in research explorer
    "test_rows_sample": test_rows[:60]
}

with open('src/data/researchData.json', 'w') as f:
    json.dump(dataset_export, f, indent=2)

print("Exported researchData.json successfully! Sample count:", len(formatted_samples))
