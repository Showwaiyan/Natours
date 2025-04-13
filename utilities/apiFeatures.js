class APIFeatures {
	constructor(query, reqQuery) {
		this.query = query;
		this.reqQuery = reqQuery;
	}

	filter() {
		// Execulde non-query field
		let queryObj = { ...this.reqQuery };

		const execludeField = ["page", "limit", "sort", "fields"];
		execludeField.forEach((element) => delete queryObj[element]);

		// Filtering
		queryObj = JSON.parse(JSON.stringify(queryObj).replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`));

		this.query = this.query.find(queryObj);
		return this;
	}

	sort() {
		// Sorting
		if (this.reqQuery.sort) {
			const sortBy = this.reqQuery.sort.split(",").join(" ");
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort("-createAt");
		}
		return this;
	}

	limitFields() {
		// Field limiting
		if (this.reqQuery.fields) {
			const fields = this.reqQuery.fields.split(",").join(" ");
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select("-__v");
		}
		return this;
	}

	pagination() {
		// Pagination
		const page = this.reqQuery.page * 1 || 1;
		const limit = this.reqQuery.limit * 1 || 10;

		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

module.exports = APIFeatures;
