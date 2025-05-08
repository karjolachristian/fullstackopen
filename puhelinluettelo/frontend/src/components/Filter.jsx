export default function Filter({ onChangeHandle }) {
  return (
    <div>
      filter shown with: <input onChange={onChangeHandle}/>
    </div>
  );
}  