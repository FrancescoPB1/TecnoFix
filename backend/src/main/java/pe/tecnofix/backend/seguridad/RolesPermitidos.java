package pe.tecnofix.backend.seguridad;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import pe.tecnofix.backend.modelo.Rol;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RolesPermitidos {

    Rol[] value();
}