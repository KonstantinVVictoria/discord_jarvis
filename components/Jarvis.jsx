export default function Jarvis({ data }) {
  return (
    <>
      <p>{data.status}</p>
      <button
        onMouseDown={() => {
          data.Jarvis.listen();
        }}
      >
        Initialize
      </button>
    </>
  );
}
