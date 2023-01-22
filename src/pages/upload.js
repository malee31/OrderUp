export default function Upload() {
	return (
		<main className="flex flex-col w-full h-full px-3 md:px-8 lg:px-20 xl:px-32 py-8 bg-gray-100 relative overflow-y-auto">
			<h1 className="text-center text-3xl">
				Image Upload
			</h1>
			<h2 className="text-center text-lg text-gray-500">
				Upload images for future use
			</h2>
			<hr className="mt-2 mb-4"/>
			<form
				className="w-[30rem] max-w-full flex flex-col items-center self-center gap-4"
				method="POST"
				action="/images/upload"
				encType="multipart/form-data"
			>
				<label className="text-center">
					<span className="text-lg">Choose an Image to Upload</span>
					<input className="px-1 py-0.5 bg-gray-300 rounded" name="fileUpload" type="file" placeholder="Choose Image"/>
				</label>
				<button type="submit" className="block min-w-[8rem] px-4 py-2 bg-orange-300 rounded">Upload</button>
			</form>
		</main>
	);
}