const communities = [
  "วัดโพธิ์ทรายทอง",
  "ละหานทราย",
  "ตลาดสด",
  "โคกเก่า",
  "คุ้มถ่าน",
  "โคกงิ้วใต้",
  "โคกงิ้วเหนือ",
  "สะเดา",
  "สนวน",
  "โรงเลื่อย",
  "โคกจำปี",
  "โรงงาน",
  "โรงเตา",
  "หนองปรือเหนือ",
  "หนองปรือใต้",
  "ชลประทานเหนือ",
  "ชลประทานใต้",
];

const CommunitySelector = ({ selected, onSelect = () => {}, error }) => (
  <div className="mb-4">
    <div className="flex py-2 gap-2">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        1.เลือกชุมชน
      </label>
      {error && <div className="text-red-500 text-sm ml-auto">{error}</div>}
    </div>
    <div className="flex flex-wrap gap-2">
      {communities.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onSelect(c)}
          className={`btn btn-sm rounded-full px-4 py-2 text-base font-medium ${
            selected === c
              ? "bg-pink-400 text-white border-none"
              : "bg-pink-100 text-pink-500 hover:bg-pink-200 border-none"
          } transition duration-200 min-w-[120px] max-w-full sm:w-auto`}
        >
          {c}
        </button>
      ))}
    </div>
  </div>
);
export default CommunitySelector;
