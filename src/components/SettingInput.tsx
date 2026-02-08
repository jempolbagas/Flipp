


export const SettingInput = ({ label, value, onChange }: { label: string, value: number, onChange: (n: number) => void }) => (
    <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center">
        <label className="font-bold text-slate-600">{label}</label>
        <input
            type="number"
            value={value}
            onChange={e => onChange(parseInt(e.target.value) || 0)}
            className="w-20 text-center font-bold text-lg bg-white border-2 border-slate-200 rounded-lg py-1 focus:border-violet-400 outline-none text-violet-600"
        />
    </div>
);

export default SettingInput;
