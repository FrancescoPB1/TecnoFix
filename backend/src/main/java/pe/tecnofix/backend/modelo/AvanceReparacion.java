package pe.tecnofix.backend.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;


@Entity
@Table(name = "avances_reparacion")
public class AvanceReparacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Orden orden;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false, length = 80)
    private String tecnico;

    @Column(nullable = false, length = 500)
    private String actividad;

    @Column(length = 300)
    private String repuestos;

    @Column(length = 500)
    private String pruebas;

    public AvanceReparacion() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @JsonIgnore
    public Orden getOrden() {
        return orden;
    }

    public void setOrden(Orden orden) {
        this.orden = orden;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getTecnico() {
        return tecnico;
    }

    public void setTecnico(String tecnico) {
        this.tecnico = tecnico;
    }

    public String getActividad() {
        return actividad;
    }

    public void setActividad(String actividad) {
        this.actividad = actividad;
    }

    public String getRepuestos() {
        return repuestos;
    }

    public void setRepuestos(String repuestos) {
        this.repuestos = repuestos;
    }

    public String getPruebas() {
        return pruebas;
    }

    public void setPruebas(String pruebas) {
        this.pruebas = pruebas;
    }

}