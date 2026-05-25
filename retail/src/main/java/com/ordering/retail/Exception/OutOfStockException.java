package com.ordering.retail.Exception;

public class OutOfStockException extends RuntimeException {
	public OutOfStockException() {
		super();
	}

	public OutOfStockException(String message) {
		super(message);
	}
}
