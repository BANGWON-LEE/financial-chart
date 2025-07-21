export default function NumberInput(props) {
  const { title, defaultValue, onChange, index } = props

  return (
    <div>
      <label>{title} : </label>
      <input
        type="number"
        className="w-[70px]"
        defaultValue={defaultValue}
        onChange={event => onChange(event.currentTarget.value, index || null)}
      />
    </div>
  )
}
