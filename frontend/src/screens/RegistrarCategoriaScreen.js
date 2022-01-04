import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { registerCategoria } from "../redux/actions/categoriasActions";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { CATEGORIA_REGISTER_RESET } from "../redux/constants/categoriaConstants";

function RegistrarCategoriaScreen({ history }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const [nombre, setNombre] = useState("");
	const [descripcion, setDescripcion] = useState("");

	const categorias = useSelector((state) => state.categoriasRegister);
	const { error, success, loading } = categorias;

	const dispatch = useDispatch();

	useEffect(() => {
		if (!userInfo) {
			history.push("/login?redirect=/verCategorias");
		}

		if (success) {
			dispatch({ type: CATEGORIA_REGISTER_RESET });
			history.push("/verCategorias");
		}
	}, [history, userInfo, success]);

	const submitHandler = (data) => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				denyButton: "btn btn-danger",
				cancelButton: "btn btn-primary",
				confirmButton: "btn btn-success",
			},
			buttonsStyling: false,
		});

		swalWithBootstrapButtons
			.fire({
				title: "Quieres guardar la categoria?",
				showCancelButton: true,
				cancelButtonText: `Cancelar`,
				confirmButtonText: `Guardar`,
			})
			.then((result) => {
				if (result.isConfirmed) {
					dispatch(
						registerCategoria(
							data.nombre,
							data.descripcion,
							userInfo.id
						)
					);
					//swalWithBootstrapButtons.fire("Guardado!", "", "success");
				} else if (result.isDenied) {
					swalWithBootstrapButtons.fire(
						"Datos no guardados",
						"",
						"info"
					);
				}
			});
	};

	const fireSuccess = Swal.mixin({
		customClass: {
			confirmButton: "btn btn-success",
		},
		buttonsStyling: false,
	});

	if (success) {
		fireSuccess.fire("Guardado!", "", "success");
	}

	const fireError = Swal.mixin({
		customClass: {
			confirmButton: "btn btn-danger",
		},
		buttonsStyling: false,
	});

	if (error) {
		fireError.fire(`Error al registrar el texto:`, `${error}`, "info");
		dispatch({ type: CATEGORIA_REGISTER_RESET });
	}

	const redirectVerCategorias = () => {
		history.push("/verCategorias");
	};

	const validationSchema = Yup.object().shape({
		nombre: Yup.string().required("Campo obligatorio"),
		descripcion: Yup.string().notRequired(),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(validationSchema) });

	const onSubmit = (data) => {
		submitHandler(data);
	};

	return (
		<div>
			{userInfo ? (
				<div>
					<br />

					<Button
						variant="primary"
						onClick={redirectVerCategorias}
						size="sm"
					>
						<span>&#8592;</span> Categorias
					</Button>

					<h1>
						<i className="fas fa-plus"></i> Categoria
					</h1>

					<Form onSubmit={handleSubmit(onSubmit)}>
						<Form.Group controlId="nombre">
							<Form.Control
								type="text"
								placeholder="Nombre"
								{...register("nombre")}
								className={`form-control ${
									errors.nombre ? "is-invalid" : ""
								}`}
							></Form.Control>
							<div className="invalid-feedback">
								{errors.nombre?.message}
							</div>
						</Form.Group>

						<Form.Group controlId="descripcion">
							<Form.Control
								type="name"
								placeholder="Descripcion"
								{...register("descripcion")}
							></Form.Control>
						</Form.Group>

						<Button type="submit" variant="primary">
							Registrar
						</Button>
					</Form>
				</div>
			) : null}
		</div>
	);
}

export default RegistrarCategoriaScreen;
