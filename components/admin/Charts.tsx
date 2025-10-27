
import React from 'react';

interface PieChartProps {
    data: { label: string; value: number; color: string }[];
    title: string;
}

const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
};

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) {
        return (
            <div className="bg-card border border-border rounded-lg shadow-sm p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                <h3 className="text-lg font-bold mb-4">{title}</h3>
                <p className="text-muted-foreground">No hay datos disponibles.</p>
            </div>
        );
    }
    
    let cumulativePercent = 0;

    return (
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4 text-center">{title}</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="relative w-48 h-48">
                    <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
                        {data.map((item, index) => {
                            const percent = item.value / total;
                            // This ensures that small slices are still visible and don't create artifacts
                            const adjustedPercent = Math.max(percent, 0.00001);
                            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                            cumulativePercent += adjustedPercent;
                            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                            const largeArcFlag = adjustedPercent > 0.5 ? 1 : 0;

                            const pathData = [
                                `M ${startX} ${startY}`,
                                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                                `L 0 0`,
                            ].join(' ');

                            return <path key={index} d={pathData} fill={item.color} />;
                        })}
                    </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center flex-col">
                           <span className="text-2xl font-bold">{total}</span>
                           <span className="text-xs text-muted-foreground">Total</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <span className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: item.color }}></span>
                            <span className="text-sm font-medium">{item.label}: <span className="font-bold">{item.value}</span> ({(item.value / total * 100).toFixed(0)}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
