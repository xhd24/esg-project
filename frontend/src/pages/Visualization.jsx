import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF6699", "#66CC99", "#CC9966"];

const EXT_LABELS = ["원자재 채취", "기자재 제조", "운송", "선박 폐기", "재활용"];
const INT_LABELS = ["설계", "강재적치", "강재절단", "조립", "의장", "탑재", "안벽작업", "시운전"];

export default function Visualization({ lastSavedExt, lastSavedInn }) {
    const extData = (lastSavedExt?.items || [])
        .map((v, i) => ({ name: EXT_LABELS[i], value: Number(v || 0) }))
        .filter(d => d.value > 0);

    const innData = (lastSavedInn?.steps || [])
        .map((v, i) => ({ step: INT_LABELS[i], value: Number(v || 0) }))
        .filter(d => d.value > 0);

    return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {lastSavedExt && extData.length > 0 && (

                <PieChart width={600} height={300}>
                    <Pie data={extData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                        {extData.map((entry, idx) => (
                            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>

            )}

            {lastSavedInn && innData.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={innData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="step" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

