// components/SearchInput.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"; // Assuming you're using Shadcn components
import { Button } from "@/components/ui/button";
import { generateSlug } from "@/utils/commonFunc";

interface SearchInputProps {
	placeholder?: string;
	inputValue?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
	placeholder = "Search courses...",
	inputValue = "",
}) => {
	const [query, setQuery] = useState(inputValue);
	const router = useRouter();

	const handleSearch = () => {
		if (query) {
			router.push(`/courses/search?query=${generateSlug(query)}`);
		}
	};

	return (
		<div className="flex justify-center items-center space-x-4 mb-8">
			<Input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder={placeholder}
				className="w-full max-w-md"
			/>
			<Button variant="default" size="lg" onClick={handleSearch}>
				Search
			</Button>
		</div>
	);
};

export default SearchInput;
