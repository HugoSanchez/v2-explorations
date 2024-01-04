import { useEffect, useRef, useState } from "react";
import { CollectionFeed } from "@/components/feeds/CollectionFeed";
import { AddMediaButton } from "@/components/main/AddMediaButton";
import useGetCollectionTokens from "@/hooks/useGetCollectionTokens";
import { Drawer } from "@/components/common/Drawer";
import { MintPictureForm } from "@/components/forms/MintPictureForm";
import { NextPage } from "next";
import { GetStaticPaths } from "next";
import { Spinner } from "@/components/common/Spinner";

export const getStaticPaths: GetStaticPaths<{ handle: string }> = async () => {
	return {
		paths: [],
		fallback: "blocking",
	};
};

export async function getStaticProps({ params }: any) {
	let id = params.collectionId;
	return { props: { id } };
}

const Collection: NextPage = (props: any) => {
	const [fireFetch, setFireFetch] = useState<boolean>(false);
	const [openCreateDrawer, setOpenCreateDrawer] = useState<boolean>(false);
	const { data, error, isLoading, mutate } = useGetCollectionTokens(props.id);

	useEffect(() => {
		if (fireFetch) {
			mutate();
			setFireFetch(false);
		}
		console.log("DATA: ", data);
	}, [data, fireFetch]);

	if (isLoading) {
		return (
			<main className="flex items-center justify-center min-w-screen min-h-screen">
				<Spinner />
			</main>
		);
	}

	return (
		<main className="flex flex-col px-32 py-20 min-w-screen min-h-screen">
			<Drawer isOpen={openCreateDrawer} setIsOpen={setOpenCreateDrawer}>
				<MintPictureForm
					address={data.address}
					fireFetch={() => setFireFetch(true)}
					onClickBack={() => setOpenCreateDrawer(false)}
				/>
			</Drawer>
			<div className="-z-30 w-full h-32 flex flex-col items-center justify-center">
				<h1 className="font-hedvig font-light z-0">
					{data?.metadata?.title}
				</h1>
				<p className="text-zinc-600 mt-4">
					created by {data?.moderators[0]?.handle}.verso
				</p>
			</div>
			<div className="h-full w-full mt-10">
				{true ? (
					<div className="w-full h-full grid grid-cols-4">
						{data?.tokens?.nfts.map((item: any, index: number) => {
							return (
								<div
									key={index}
									className="w-full h-96 p-2 mb-10 flex justify-center"
								>
									<img
										alt=""
										src={item.media[0]?.gateway}
										className={`w-full cursor-pointer object-contain`}
									/>
								</div>
							);
						})}
					</div>
				) : (
					<CollectionFeed
						id={props.id}
						items={data?.tokens?.nfts || []}
					/>
				)}
			</div>
			<AddMediaButton openCreate={() => setOpenCreateDrawer(true)} />
		</main>
	);
};

export default Collection;

/***
 * 
 * 	const handleDragEnter = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
		console.log("Entered");
	};

	const handleDragLeave = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		console.log("Leaved");
	};

	const handleDragOver = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
		console.log("Over");
	};

	const handleDrop = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			console.log(e.dataTransfer.files);
			for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
				setFiles((prevState: any) => [
					...prevState,
					window.URL.createObjectURL(e.dataTransfer.files[i]),
				]);
			}
		}
		console.log("Dropped");
	};

	function handleChange(e: any) {
		e.preventDefault();
		console.log("File has been added");
		if (e.target.files && e.target.files[0]) {
			console.log(e.target.files);
			for (let i = 0; i < e.target.files["length"]; i++) {
				if (e.target.files[i].type.includes("image")) {
					setFiles((prevState: any) => [
						...prevState,
						e.target.files[i],
					]);
				}
			}
		}
	}

	function openFileExplorer() {
		inputRef.current.value = "";
		inputRef.current.click();
	}

 * 
 * <form
					className={`${
						dragActive ? "bg-blue-400" : "bg-blue-100"
					}  p-4 w-1/3 rounded-lg  min-h-[10rem] text-center flex flex-col items-center justify-center`}
					onDragEnter={handleDragEnter}
					onSubmit={(e) => e.preventDefault()}
					onDrop={handleDrop}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
				>
					<input
						placeholder="fileInput"
						className="hidden w-full h-full"
						ref={inputRef}
						type="file"
						multiple={true}
						onChange={handleChange}
						accept="image/*"
					/>
					<p>
						Drag & Drop files or{" "}
						<span
							className="font-bold text-blue-600 cursor-pointer"
							onClick={openFileExplorer}
						>
							<u>Select files</u>
						</span>{" "}
						to upload
					</p>
				</form>
 */
