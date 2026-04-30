import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFilePdf, FaFileCsv, FaDumbbell, FaAppleAlt, FaChartLine, FaBullseye } from 'react-icons/fa';

const exportCSV = (data, filename) => {
    if (!data || data.length === 0) return alert('No data to export');
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

const Reports = () => {
    const [loading, setLoading] = useState({});

    const setLoad = (key, val) => setLoading(prev => ({ ...prev, [key]: val }));

    // ── WORKOUT PDF ──
    const exportWorkoutsPDF = async () => {
        setLoad('wPDF', true);
        try {
            const { data } = await axios.get('/api/workouts');
            if (!data.length) return alert('No workout data to export');
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.setTextColor(0, 210, 255);
            doc.text('FitTrack Pro — Workout Report', 14, 20);
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

            data.forEach((workout, i) => {
                if (i > 0) doc.addPage();
                doc.setFontSize(13);
                doc.setTextColor(0);
                doc.text(`${workout.name} — ${workout.category}`, 14, 40);
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text(`Date: ${new Date(workout.date).toLocaleDateString()}`, 14, 48);
                if (workout.exercises?.length) {
                    autoTable(doc, {
                        startY: 55,
                        head: [['Exercise', 'Sets', 'Reps', 'Weight (kg)']],
                        body: workout.exercises.map(ex => [ex.name, ex.sets, ex.reps, ex.weight]),
                        headStyles: { fillColor: [0, 210, 255], textColor: 0 },
                        alternateRowStyles: { fillColor: [245, 245, 245] }
                    });
                }
            });
            doc.save('workouts-report.pdf');
        } catch (e) { alert('Error generating PDF'); }
        finally { setLoad('wPDF', false); }
    };

    // ── WORKOUT CSV ──
    const exportWorkoutsCSV = async () => {
        setLoad('wCSV', true);
        try {
            const { data } = await axios.get('/api/workouts');
            const flat = data.flatMap(w =>
                (w.exercises || [{ name: '-', sets: 0, reps: 0, weight: 0 }]).map(ex => ({
                    Date: new Date(w.date).toLocaleDateString(),
                    Workout: w.name,
                    Category: w.category,
                    Exercise: ex.name,
                    Sets: ex.sets,
                    Reps: ex.reps,
                    'Weight(kg)': ex.weight
                }))
            );
            exportCSV(flat, 'workouts.csv');
        } catch (e) { alert('Error exporting CSV'); }
        finally { setLoad('wCSV', false); }
    };

    // ── NUTRITION PDF ──
    const exportNutritionPDF = async () => {
        setLoad('nPDF', true);
        try {
            const { data } = await axios.get('/api/nutrition');
            if (!data.length) return alert('No nutrition data to export');
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.setTextColor(27, 197, 189);
            doc.text('FitTrack Pro — Nutrition Report', 14, 20);
            doc.setFontSize(10); doc.setTextColor(100);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

            const rows = data.flatMap(log =>
                log.foodItems.map(item => [
                    new Date(log.date).toLocaleDateString(),
                    log.mealType,
                    item.name,
                    item.calories,
                    item.protein + 'g',
                    item.carbs + 'g',
                    item.fats + 'g'
                ])
            );
            autoTable(doc, {
                startY: 36,
                head: [['Date', 'Meal', 'Food', 'Calories', 'Protein', 'Carbs', 'Fats']],
                body: rows,
                headStyles: { fillColor: [27, 197, 189], textColor: 255 },
                alternateRowStyles: { fillColor: [245, 245, 245] }
            });
            doc.save('nutrition-report.pdf');
        } catch (e) { alert('Error generating PDF'); }
        finally { setLoad('nPDF', false); }
    };

    // ── NUTRITION CSV ──
    const exportNutritionCSV = async () => {
        setLoad('nCSV', true);
        try {
            const { data } = await axios.get('/api/nutrition');
            const flat = data.flatMap(log =>
                log.foodItems.map(item => ({
                    Date: new Date(log.date).toLocaleDateString(),
                    MealType: log.mealType,
                    Food: item.name,
                    Calories: item.calories,
                    Protein_g: item.protein,
                    Carbs_g: item.carbs,
                    Fats_g: item.fats
                }))
            );
            exportCSV(flat, 'nutrition.csv');
        } catch (e) { alert('Error exporting CSV'); }
        finally { setLoad('nCSV', false); }
    };

    // ── PROGRESS PDF ──
    const exportProgressPDF = async () => {
        setLoad('pPDF', true);
        try {
            const { data } = await axios.get('/api/progress');
            if (!data.length) return alert('No progress data to export');
            const doc = new jsPDF();
            doc.setFontSize(18); doc.setTextColor(137, 80, 252);
            doc.text('FitTrack Pro — Progress Report', 14, 20);
            doc.setFontSize(10); doc.setTextColor(100);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
            autoTable(doc, {
                startY: 36,
                head: [['Date', 'Weight (kg)', 'Body Fat %', 'Waist', 'Chest']],
                body: data.map(l => [
                    new Date(l.date).toLocaleDateString(),
                    l.weight,
                    l.bodyFat ?? '-',
                    l.measurements?.waist ?? '-',
                    l.measurements?.chest ?? '-'
                ]),
                headStyles: { fillColor: [137, 80, 252], textColor: 255 },
                alternateRowStyles: { fillColor: [245, 245, 245] }
            });
            doc.save('progress-report.pdf');
        } catch (e) { alert('Error generating PDF'); }
        finally { setLoad('pPDF', false); }
    };

    // ── PROGRESS CSV ──
    const exportProgressCSV = async () => {
        setLoad('pCSV', true);
        try {
            const { data } = await axios.get('/api/progress');
            const flat = data.map(l => ({
                Date: new Date(l.date).toLocaleDateString(),
                Weight_kg: l.weight,
                BodyFat: l.bodyFat ?? '',
                Waist: l.measurements?.waist ?? '',
                Chest: l.measurements?.chest ?? '',
                Hips: l.measurements?.hips ?? '',
                Arms: l.measurements?.arms ?? '',
                Legs: l.measurements?.legs ?? ''
            }));
            exportCSV(flat, 'progress.csv');
        } catch (e) { alert('Error exporting CSV'); }
        finally { setLoad('pCSV', false); }
    };

    // ── GOALS CSV ──
    const exportGoalsCSV = async () => {
        setLoad('gCSV', true);
        try {
            const { data } = await axios.get('/api/goals');
            const flat = data.map(g => ({
                Title: g.title,
                Type: g.type,
                Target: g.targetValue,
                Current: g.currentValue,
                Status: g.status,
                Deadline: g.deadline ? new Date(g.deadline).toLocaleDateString() : ''
            }));
            exportCSV(flat, 'goals.csv');
        } catch (e) { alert('Error exporting CSV'); }
        finally { setLoad('gCSV', false); }
    };

    const cardStyle = { backgroundColor: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' };
    const btnStyle = (color) => ({ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: color, color: 'white', transition: 'opacity 0.2s' });

    const ReportCard = ({ icon, title, subtitle, color, onPDF, onCSV, pdfLoading, csvLoading }) => (
        <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                    {icon}
                </div>
                <div>
                    <h3 style={{ margin: 0, color: '#3f4254', fontSize: '16px' }}>{title}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#b5b5c3' }}>{subtitle}</p>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {onPDF && (
                    <button style={btnStyle('#f64e60')} onClick={onPDF} disabled={pdfLoading}>
                        <FaFilePdf /> {pdfLoading ? 'Generating...' : 'Export PDF'}
                    </button>
                )}
                {onCSV && (
                    <button style={btnStyle('#1bc5bd')} onClick={onCSV} disabled={csvLoading}>
                        <FaFileCsv /> {csvLoading ? 'Exporting...' : 'Export CSV'}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <h2 style={{ color: '#181c32', marginBottom: '8px' }}>Reports & Export</h2>
            <p style={{ color: '#b5b5c3', marginBottom: '30px', fontSize: '14px' }}>Download your fitness data as PDF or CSV</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
                <ReportCard
                    icon={<FaDumbbell size={22} />} color="#00d2ff"
                    title="Workout Report" subtitle="All workout sessions with exercises"
                    onPDF={exportWorkoutsPDF} onCSV={exportWorkoutsCSV}
                    pdfLoading={loading.wPDF} csvLoading={loading.wCSV}
                />
                <ReportCard
                    icon={<FaAppleAlt size={22} />} color="#1bc5bd"
                    title="Nutrition Report" subtitle="All meal logs with macros"
                    onPDF={exportNutritionPDF} onCSV={exportNutritionCSV}
                    pdfLoading={loading.nPDF} csvLoading={loading.nCSV}
                />
                <ReportCard
                    icon={<FaChartLine size={22} />} color="#8950fc"
                    title="Progress Report" subtitle="Weight & body measurement history"
                    onPDF={exportProgressPDF} onCSV={exportProgressCSV}
                    pdfLoading={loading.pPDF} csvLoading={loading.pCSV}
                />
                <ReportCard
                    icon={<FaBullseye size={22} />} color="#3699ff"
                    title="Goals Report" subtitle="All fitness goals and status"
                    onCSV={exportGoalsCSV} csvLoading={loading.gCSV}
                />
            </div>
        </div>
    );
};

export default Reports;
