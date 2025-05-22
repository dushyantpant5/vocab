'use client';

export default function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col p-4 bg-white rounded-xl shadow-md border border-blue-100">
            <div className="text-xs text-blue-700 whitespace-pre-line">{label}</div>
            <div className="text-lg font-bold text-blue-900">{value}</div>
        </div>
    );
}
