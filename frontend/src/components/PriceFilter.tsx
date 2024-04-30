type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
  return (
    <div>
      <h4 className='font-semibold mb-2'>Max Price</h4>
      <select
        value={selectedPrice}
        onChange={(event) =>
          onChange(
            event.target.value ? parseInt(event.target.value) : undefined,
          )
        }
        className='p-2 border rounded-md w-full'
      >
        <option value=''>Select Max Price</option>
        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
          (price, index) => (
            <option value={price} key={index}>
              {price}
            </option>
          ),
        )}
      </select>
    </div>
  );
};

export default PriceFilter;
